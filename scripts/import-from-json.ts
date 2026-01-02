/**
 * Manual Aircraft Import Script
 *
 * This script imports aircraft data from a JSON file.
 * Use this as an alternative if the automated scraper doesn't work.
 *
 * Usage:
 * 1. Create a JSON file (e.g., aircraft-data.json) with your aircraft data
 * 2. Run: npm run import-aircraft path/to/aircraft-data.json
 */

import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as https from 'https'
import * as http from 'http'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

interface ImportAircraft {
  title: string
  manufacturer: string
  model: string
  year_manufactured: number
  category?: 'jet' | 'turboprop' | 'helicopter' | 'piston'
  status?: 'available' | 'sold' | 'pending' | 'draft'
  description?: string
  registration_number?: string
  serial_number?: string
  total_time_hours?: number
  engines?: number
  passengers_capacity?: number
  max_range_nm?: number
  max_speed_kts?: number
  cruise_speed_kts?: number
  max_altitude_ft?: number
  price?: number
  price_currency?: string
  is_price_negotiable?: boolean
  features?: string[]
  primary_image_url?: string
  featured?: boolean
}

/**
 * Download image from URL and return as Buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirect
        const location = res.headers.location
        if (location) {
          return downloadImage(location).then(resolve).catch(reject)
        }
      }

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
 * Create aircraft entry in database
 */
async function createAircraft(data: ImportAircraft, userId: string | null): Promise<string> {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let imageUrl = data.primary_image_url

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
      console.error(`  ⚠️  Failed to download/upload image:`, error)
      imageUrl = undefined
    }
  }

  const aircraftData: Database['public']['Tables']['aircraft']['Insert'] = {
    title: data.title,
    slug: slug,
    status: data.status || 'available',
    manufacturer: data.manufacturer,
    model: data.model,
    year_manufactured: data.year_manufactured,
    category: data.category || 'jet',
    description: data.description || null,
    registration_number: data.registration_number || null,
    serial_number: data.serial_number || null,
    total_time_hours: data.total_time_hours || null,
    engines: data.engines || null,
    passengers_capacity: data.passengers_capacity || null,
    max_range_nm: data.max_range_nm || null,
    max_speed_kts: data.max_speed_kts || null,
    cruise_speed_kts: data.cruise_speed_kts || null,
    max_altitude_ft: data.max_altitude_ft || null,
    price: data.price || null,
    price_currency: data.price_currency || 'USD',
    is_price_negotiable: data.is_price_negotiable ?? true,
    features: data.features ? JSON.stringify(data.features) : null,
    primary_image_url: imageUrl || null,
    featured: data.featured || false,
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
 * Main import function
 */
async function main() {
  const jsonFile = process.argv[2]

  if (!jsonFile) {
    console.error('❌ Please provide a JSON file path')
    console.error('Usage: npm run import-aircraft path/to/aircraft-data.json')
    process.exit(1)
  }

  console.log('🚀 Starting aircraft import...\n')

  try {
    // Read JSON file
    console.log(`📥 Reading file: ${jsonFile}`)
    const fileContent = fs.readFileSync(jsonFile, 'utf-8')
    const aircraftList: ImportAircraft[] = JSON.parse(fileContent)
    console.log(`✅ Loaded ${aircraftList.length} aircraft from file\n`)

    // Set userId to null for migration (can be updated later via admin panel)
    const userId: string | null = process.env.MIGRATION_USER_ID || null

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
    console.log('📊 Import Summary:')
    console.log(`  ✅ Success: ${successCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
    console.log(`  📝 Total: ${aircraftList.length}`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Run the import
main()
