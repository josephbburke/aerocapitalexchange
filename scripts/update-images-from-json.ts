/**
 * Update Aircraft Images Script
 *
 * This script updates existing aircraft records with images from a JSON file.
 * It downloads images from URLs and uploads them to Supabase storage.
 *
 * Usage: npm run update-images scripts/sold-aircraft-about-3.json
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

interface AircraftWithImage {
  title: string
  primary_image_url?: string
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
 * Update aircraft with image
 */
async function updateAircraftImage(title: string, imageUrl: string): Promise<void> {
  // Find aircraft by title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const { data: aircraft, error: findError } = await supabase
    .from('aircraft')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (findError || !aircraft) {
    throw new Error(`Aircraft not found: ${title}`)
  }

  // Download and upload image
  console.log(`  📸 Downloading image from ${imageUrl}...`)
  const imageBuffer = await downloadImage(imageUrl)
  const uploadedUrl = await uploadImage(imageBuffer, aircraft.id, imageUrl)
  console.log(`  ✅ Image uploaded successfully`)

  // Update aircraft record
  const { error: updateError } = await supabase
    .from('aircraft')
    .update({ primary_image_url: uploadedUrl })
    .eq('id', aircraft.id)

  if (updateError) throw updateError
}

/**
 * Main update function
 */
async function main() {
  const jsonFile = process.argv[2]

  if (!jsonFile) {
    console.error('❌ Please provide a JSON file path')
    console.error('Usage: npm run update-images path/to/aircraft-data.json')
    process.exit(1)
  }

  console.log('🚀 Starting image update...\n')

  try {
    // Read JSON file
    console.log(`📥 Reading file: ${jsonFile}`)
    const fileContent = fs.readFileSync(jsonFile, 'utf-8')
    const aircraftList: AircraftWithImage[] = JSON.parse(fileContent)
    console.log(`✅ Loaded ${aircraftList.length} aircraft from file\n`)

    console.log('📝 Updating aircraft images...\n')

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (let i = 0; i < aircraftList.length; i++) {
      const aircraft = aircraftList[i]
      console.log(`[${i + 1}/${aircraftList.length}] Processing: ${aircraft.title}`)

      if (!aircraft.primary_image_url) {
        console.log(`  ⏭️  No image URL provided, skipping\n`)
        skippedCount++
        continue
      }

      try {
        await updateAircraftImage(aircraft.title, aircraft.primary_image_url)
        console.log(`  ✅ Updated successfully\n`)
        successCount++
      } catch (error) {
        console.error(`  ❌ Failed to update:`, error)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Update Summary:')
    console.log(`  ✅ Success: ${successCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
    console.log(`  ⏭️  Skipped: ${skippedCount}`)
    console.log(`  📝 Total: ${aircraftList.length}`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

// Run the update
main()
