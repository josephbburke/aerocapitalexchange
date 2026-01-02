/**
 * Aircraft Migration Script
 *
 * This script scrapes aircraft data from the old AeroCapitalExchange website
 * and imports it into the new Supabase database.
 *
 * Usage: npm run migrate-aircraft
 */

import * as dotenv from 'dotenv'
import * as https from 'https'
import * as http from 'http'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const SOURCE_URL = 'https://www.aerocapitalexchange.com/s-projects-side-by-side'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

type AircraftData = {
  title: string
  manufacturer: string
  model: string
  year_manufactured: number
  description?: string
  imageUrl?: string
  category: 'jet' | 'turboprop' | 'helicopter' | 'piston'
  status: 'available' | 'sold' | 'pending' | 'draft'
  price?: number
  total_time_hours?: number
  serial_number?: string
}

/**
 * Fetch HTML content from URL
 */
async function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    client.get(url, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve(data)
      })

      res.on('error', reject)
    }).on('error', reject)
  })
}

/**
 * Download image from URL and return as Buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    client.get(url, (res) => {
      const chunks: Buffer[] = []

      res.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk))
      })

      res.on('end', () => {
        resolve(Buffer.concat(chunks))
      })

      res.on('error', reject)
    }).on('error', reject)
  })
}

/**
 * Upload image to Supabase storage
 */
async function uploadImage(imageBuffer: Buffer, aircraftId: string, originalUrl: string): Promise<string> {
  const fileExt = originalUrl.split('.').pop()?.split('?')[0] || 'jpg'
  const fileName = `${aircraftId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('aircraft-images')
    .upload(fileName, imageBuffer, {
      contentType: `image/${fileExt}`,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('aircraft-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Parse HTML and extract aircraft data
 *
 * This parser is specifically designed for the Wix-based ICON A5 inventory page
 */
function parseAircraftData(html: string): AircraftData[] {
  const aircraft: AircraftData[] = []
  const fs = require('fs')

  // Extract all ASN numbers (Aircraft Serial Numbers)
  const asnMatches = html.match(/ASN \d+/g) || []
  const uniqueASNs = [...new Set(asnMatches)]

  console.log(`Found ${uniqueASNs.length} unique aircraft (ASN numbers)`)

  // Extract all image URLs for ICON A5 aircraft
  const imagePattern = /https:\/\/static\.wixstatic\.com\/media\/[^"'\s]+(?:IMG_\d+|icon|a5|aircraft|plane)[^"'\s]*/gi
  const images = html.match(imagePattern) || []

  // Extract all prices
  const pricePattern = /Asking Price:\s*\$(\d+)k?/g
  const prices: string[] = []
  let priceMatch
  while ((priceMatch = pricePattern.exec(html)) !== null) {
    prices.push(priceMatch[1])
  }

  // Extract all Hobbs hours
  const hobbsPattern = /Hobbs:\s*(\d+)/g
  const hobbsHours: string[] = []
  let hobbsMatch
  while ((hobbsMatch = hobbsPattern.exec(html)) !== null) {
    hobbsHours.push(hobbsMatch[1])
  }

  console.log(`Found ${prices.length} prices, ${hobbsHours.length} hobbs hours, ${images.length} images`)

  // Create aircraft entries
  uniqueASNs.forEach((asn, index) => {
    const asnNumber = asn.replace('ASN ', '')
    const price = prices[index] ? parseInt(prices[index].replace('k', '000')) : undefined
    const hobbs = hobbsHours[index] ? parseInt(hobbsHours[index]) : undefined
    const imageUrl = images[index] ? images[index].replace(/\/v1\/fill\/[^\/]+\//, '/v1/fill/w_1200,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/') : undefined

    const title = `ICON A5 - ASN ${asnNumber}`

    let description = `Pre-owned ICON A5 aircraft for sale.`
    if (hobbs) {
      description += ` Total time: ${hobbs} hours.`
    }

    // Check for common features in the HTML around this ASN
    const asnIndex = html.indexOf(asn)
    if (asnIndex !== -1) {
      const contextStart = Math.max(0, asnIndex - 500)
      const contextEnd = Math.min(html.length, asnIndex + 1500)
      const context = html.substring(contextStart, contextEnd)

      if (context.includes('GWI') || context.includes('Gross Weight Increased')) {
        description += ' Ability to upgrade to new GWI Aircraft (60lbs additional gross weight).'
      }
      if (context.includes('Fresh Water')) {
        description += ' Fresh water aircraft.'
      }
      if (context.includes('Factory') || context.includes('factory')) {
        description += ' Direct from factory.'
      }
    }

    aircraft.push({
      title: title,
      manufacturer: 'ICON',
      model: 'A5',
      year_manufactured: 2019, // Default year - ICON A5 production started around 2016
      description: description,
      imageUrl: imageUrl,
      category: 'piston', // ICON A5 is a light sport aircraft with a piston engine
      status: 'available',
      price: price,
      total_time_hours: hobbs,
      serial_number: asnNumber,
    })
  })

  // Save the HTML for inspection if needed
  if (aircraft.length === 0) {
    fs.writeFileSync('page-source.html', html)
    console.log('⚠️  No aircraft parsed. Page source saved to page-source.html for inspection')
  }

  return aircraft
}

/**
 * Create aircraft entry in database
 */
async function createAircraft(data: AircraftData, userId: string | null): Promise<string> {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let imageUrl = data.imageUrl

  // Download and upload image if URL is provided
  if (imageUrl) {
    try {
      console.log(`  📸 Downloading image from ${imageUrl}...`)

      // Handle relative URLs
      if (imageUrl.startsWith('/')) {
        imageUrl = 'https://www.aerocapitalexchange.com' + imageUrl
      }

      const imageBuffer = await downloadImage(imageUrl)
      const tempId = crypto.randomUUID()
      imageUrl = await uploadImage(imageBuffer, tempId, imageUrl)

      console.log(`  ✅ Image uploaded successfully`)
    } catch (error) {
      console.error(`  ❌ Failed to download/upload image:`, error)
      imageUrl = undefined
    }
  }

  const aircraftData: Database['public']['Tables']['aircraft']['Insert'] = {
    title: data.title,
    slug: slug,
    status: data.status,
    manufacturer: data.manufacturer,
    model: data.model,
    year_manufactured: data.year_manufactured,
    category: data.category,
    description: data.description || null,
    primary_image_url: imageUrl || null,
    price: data.price || null,
    price_currency: 'USD',
    is_price_negotiable: true,
    total_time_hours: data.total_time_hours || null,
    serial_number: data.serial_number || null,
    featured: false,
    created_by: userId,
  }

  const { data: result, error } = await supabase
    .from('aircraft')
    .insert(aircraftData)
    .select()
    .single()

  if (error) throw error

  return result.id
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting aircraft migration...\n')

  try {
    // Fetch the page
    console.log(`📥 Fetching page: ${SOURCE_URL}`)
    const html = await fetchHtml(SOURCE_URL)
    console.log(`✅ Page fetched successfully (${html.length} bytes)\n`)

    // Parse aircraft data
    console.log('🔍 Parsing aircraft data...')
    const aircraftList = parseAircraftData(html)
    console.log(`✅ Found ${aircraftList.length} aircraft\n`)

    if (aircraftList.length === 0) {
      console.log('⚠️  No aircraft found. Please check the parsing logic.')
      console.log('The page HTML has been saved to page-source.html for manual inspection.')
      return
    }

    // Set userId to null for migration (can be updated later via admin panel)
    const userId: string | null = null

    console.log('📝 Importing aircraft...\n')

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < aircraftList.length; i++) {
      const aircraft = aircraftList[i]
      console.log(`[${i + 1}/${aircraftList.length}] Importing: ${aircraft.title}`)

      try {
        const id = await createAircraft(aircraft, userId)
        console.log(`  ✅ Created successfully (ID: ${id})\n`)
        successCount++
      } catch (error) {
        console.error(`  ❌ Failed to create:`, error)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Migration Summary:')
    console.log(`  ✅ Success: ${successCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
    console.log(`  📝 Total: ${aircraftList.length}`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
main()
