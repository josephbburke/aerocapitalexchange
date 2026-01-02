/**
 * Add Enclosed Trailer Script
 */

import * as dotenv from 'dotenv'
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

async function main() {
  console.log('🚀 Adding Enclosed Trailer...\n')

  try {
    const trailerData: Database['public']['Tables']['aircraft']['Insert'] = {
      title: 'Enclosed Trailer for ICON A5',
      slug: 'enclosed-trailer-for-icon-a5',
      status: 'sold',
      manufacturer: 'Custom',
      model: 'Enclosed Trailer',
      year_manufactured: 2024,
      category: 'trailer',
      description: `Fully loaded enclosed trailer designed for ICON A5 aircraft transport.

Location: Tampa, FL

This trailer has been sold.`,
      price: 40000,
      price_currency: 'USD',
      is_price_negotiable: false,
      featured: false,
      created_by: null,
      primary_image_url: null,
    }

    const { data, error } = await supabase
      .from('aircraft')
      .insert(trailerData)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Enclosed Trailer added successfully!')
    console.log(`   ID: ${data.id}`)
    console.log(`   Title: ${data.title}`)
    console.log(`   Status: ${data.status}`)
    console.log(`   Price: $${data.price?.toLocaleString()}`)
    console.log(`   Year: ${data.year_manufactured}`)
    console.log('\n✅ Done!')

  } catch (error) {
    console.error('❌ Failed to add trailer:', error)
    process.exit(1)
  }
}

main()
