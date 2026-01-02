/**
 * Update Aircraft Status Script
 *
 * Marks aircraft as sold and updates ASN 0068 with detailed information
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
  console.log('🚀 Starting aircraft status update...\n')

  try {
    // Get all aircraft ordered by creation
    const { data: allAircraft, error: fetchError } = await supabase
      .from('aircraft')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) throw fetchError

    console.log(`📋 Found ${allAircraft?.length || 0} aircraft\n`)

    // Find ASN 0068
    const asn0068Index = allAircraft?.findIndex(a => a.serial_number === '0068') ?? -1

    if (asn0068Index === -1) {
      console.log('⚠️  ASN 0068 not found!')
      return
    }

    console.log(`✅ Found ASN 0068 at position ${asn0068Index + 1}\n`)

    // Update ASN 0068 with detailed information
    console.log('📝 Updating ASN 0068 with detailed information...')
    const asn0068 = allAircraft![asn0068Index]

    const { error: updateError } = await supabase
      .from('aircraft')
      .update({
        price: 275000,
        year_manufactured: 2018,
        registration_number: 'N465BA',
        description: `Pre-owned ICON A5 aircraft for sale. Total time: 176 hours.

Equipment & Upgrades:
• 4 Blade e-Prop propeller
• GDL 50 ADSB in & out
• Upgraded to new GWI Aircraft (60lbs additional gross weight)
• Avionics: Garmin 796

Maintenance:
• Last Annual: August 2025
• Parachute Repack & Rocket: Complete
• 5 Year Rubber Replacement: Complete
• Corrosion Prevention: Yes
• All Service Bulletins Complete: Yes

Location: Michigan`,
        total_time_hours: 176,
        features: JSON.stringify([
          '4 Blade e-Prop Propeller',
          'GDL 50 ADSB In & Out',
          'Upgraded to New GWI Aircraft (60lbs)',
          'Garmin 796 Avionics',
          'Recent Annual (Aug 2025)',
          'Parachute Repack Complete',
          '5 Year Rubber Replacement Complete',
          'Corrosion Prevention Applied',
          'All SBs Complete',
        ]),
      })
      .eq('id', asn0068.id)

    if (updateError) throw updateError
    console.log('✅ ASN 0068 updated successfully\n')

    // Mark all aircraft after ASN 0068 as sold
    const aircraftToMarkSold = allAircraft!.slice(asn0068Index + 1)

    console.log(`📝 Marking ${aircraftToMarkSold.length} aircraft as SOLD...\n`)

    let soldCount = 0
    for (const aircraft of aircraftToMarkSold) {
      const { error } = await supabase
        .from('aircraft')
        .update({ status: 'sold' })
        .eq('id', aircraft.id)

      if (error) {
        console.error(`  ❌ Failed to update ${aircraft.title}:`, error)
      } else {
        console.log(`  ✅ Marked as SOLD: ${aircraft.title}`)
        soldCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Update Summary:')
    console.log(`  ✅ ASN 0068 updated with detailed info`)
    console.log(`  ✅ ${soldCount} aircraft marked as SOLD`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

main()
