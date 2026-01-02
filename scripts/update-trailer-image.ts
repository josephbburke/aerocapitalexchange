/**
 * Update Trailer Image Script
 */

import * as dotenv from 'dotenv'
import * as https from 'https'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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

async function uploadImage(imageBuffer: Buffer, id: string, originalUrl: string): Promise<string> {
  const fileExt = 'png'
  const fileName = `${id}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('aircraft-images')
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('aircraft-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

async function main() {
  console.log('🚀 Updating trailer image...\n')

  try {
    // Find the trailer
    const { data: trailer, error: findError } = await supabase
      .from('aircraft')
      .select('*')
      .eq('category', 'trailer')
      .single()

    if (findError) throw findError
    if (!trailer) {
      console.error('❌ Trailer not found!')
      process.exit(1)
    }

    console.log(`✅ Found trailer: ${trailer.title}`)

    // Download image
    const imageUrl = 'https://static.wixstatic.com/media/b2fa4a_f202c898d66b4f248627147df1384852~mv2.png/v1/crop/x_95,y_704,w_3937,h_2012/fill/w_1200,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/IMG_4938_heic.png'

    console.log(`📸 Downloading image...`)
    const imageBuffer = await downloadImage(imageUrl)

    console.log(`📤 Uploading to Supabase...`)
    const uploadedUrl = await uploadImage(imageBuffer, trailer.id, imageUrl)

    // Update trailer with image URL
    const { error: updateError } = await supabase
      .from('aircraft')
      .update({ primary_image_url: uploadedUrl })
      .eq('id', trailer.id)

    if (updateError) throw updateError

    console.log(`✅ Image uploaded successfully!`)
    console.log(`   URL: ${uploadedUrl}`)
    console.log('\n✅ Trailer updated!')

  } catch (error) {
    console.error('❌ Failed to update trailer image:', error)
    process.exit(1)
  }
}

main()
