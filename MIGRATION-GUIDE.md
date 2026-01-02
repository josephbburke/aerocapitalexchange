# Aircraft Migration Guide

This guide will help you migrate aircraft listings from your old AeroCapitalExchange website to the new platform.

## Overview

You have two options for migrating aircraft data:

1. **Automated Migration** - Automatically scrape and import data from the old website
2. **Manual Import** - Manually create a JSON file with aircraft data and import it

## Prerequisites

Before starting, ensure you have:

1. ✅ Supabase project set up with the aircraft table
2. ✅ Storage bucket `aircraft-images` created in Supabase
3. ✅ Environment variables configured in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MIGRATION_USER_ID` (optional - your admin user ID)

## Option 1: Automated Migration

This method automatically scrapes the old website and imports all aircraft.

### Steps:

1. **Run the migration script:**
   ```bash
   npm run migrate-aircraft
   ```

2. **Review the output:**
   - The script will fetch the page, parse aircraft listings, download images, and create database entries
   - You'll see a summary showing successful imports and any errors

3. **Troubleshooting:**
   - If no aircraft are found, the script saves the page HTML to `page-source.html`
   - You can inspect this file and update the parsing logic in `scripts/migrate-aircraft.ts`
   - The parsing logic may need adjustment based on the actual HTML structure

### What it does:

- ✅ Fetches HTML from https://www.aerocapitalexchange.com/s-projects-side-by-side
- ✅ Parses aircraft listings (title, description, images)
- ✅ Downloads images from the old site
- ✅ Uploads images to your Supabase storage
- ✅ Creates aircraft entries in your database
- ✅ Generates SEO-friendly slugs automatically

## Option 2: Manual Import

This method allows you to manually specify aircraft data in a JSON file.

### Steps:

1. **Create your aircraft data file:**

   Copy the template:
   ```bash
   cp scripts/aircraft-data-template.json my-aircraft.json
   ```

2. **Edit the JSON file:**

   Open `my-aircraft.json` and add your aircraft data. Each aircraft should have:

   ```json
   {
     "title": "Gulfstream G650 - 2020",
     "manufacturer": "Gulfstream",
     "model": "G650",
     "year_manufactured": 2020,
     "category": "jet",
     "status": "available",
     "description": "Aircraft description here...",
     "registration_number": "N123AB",
     "serial_number": "6123",
     "total_time_hours": 850,
     "engines": 2,
     "passengers_capacity": 18,
     "max_range_nm": 7000,
     "max_speed_kts": 516,
     "cruise_speed_kts": 488,
     "max_altitude_ft": 51000,
     "price": 45000000,
     "price_currency": "USD",
     "is_price_negotiable": true,
     "features": [
       "Feature 1",
       "Feature 2"
     ],
     "primary_image_url": "https://example.com/image.jpg",
     "featured": true
   }
   ```

3. **Run the import:**
   ```bash
   npm run import-aircraft my-aircraft.json
   ```

4. **Review the results:**
   - The script will show progress for each aircraft
   - Images will be downloaded and uploaded automatically
   - You'll see a summary at the end

## Field Definitions

### Required Fields:
- `title` - Full aircraft title (e.g., "Gulfstream G650 - 2020")
- `manufacturer` - Aircraft manufacturer (e.g., "Gulfstream")
- `model` - Aircraft model (e.g., "G650")
- `year_manufactured` - Year the aircraft was manufactured

### Optional Fields:
- `category` - One of: "jet", "turboprop", "helicopter", "piston" (default: "jet")
- `status` - One of: "available", "sold", "pending", "draft" (default: "available")
- `description` - Detailed description of the aircraft
- `registration_number` - Aircraft registration/tail number
- `serial_number` - Manufacturer serial number
- `total_time_hours` - Total flight hours
- `engines` - Number of engines
- `passengers_capacity` - Passenger capacity
- `max_range_nm` - Maximum range in nautical miles
- `max_speed_kts` - Maximum speed in knots
- `cruise_speed_kts` - Cruise speed in knots
- `max_altitude_ft` - Maximum altitude in feet
- `price` - Price in specified currency
- `price_currency` - Currency code (default: "USD")
- `is_price_negotiable` - Whether price is negotiable (default: true)
- `features` - Array of feature strings
- `primary_image_url` - URL to the primary aircraft image
- `featured` - Whether to feature this aircraft (default: false)

## Image Handling

Both migration methods handle images automatically:

1. **External URLs**: If you provide image URLs (starting with http/https), the script will:
   - Download the image
   - Upload it to your Supabase `aircraft-images` bucket
   - Update the aircraft record with the new URL

2. **Relative URLs**: If the image URL starts with `/`, it will be prefixed with `https://www.aerocapitalexchange.com`

3. **Failed Downloads**: If an image fails to download, the aircraft will still be created without an image

## Verifying the Migration

After running either migration method:

1. **Check the database:**
   - Go to your Supabase dashboard
   - Open the `aircraft` table
   - Verify all aircraft were created

2. **Check the storage:**
   - Go to Storage > `aircraft-images`
   - Verify images were uploaded

3. **View in the admin panel:**
   - Start your dev server: `npm run dev`
   - Go to http://localhost:3000/admin
   - Click "Manage Aircraft"
   - Verify all listings appear correctly

## Common Issues

### "Missing Supabase credentials"
- Ensure `.env.local` exists with valid credentials
- Restart your terminal after creating/updating `.env.local`

### "No aircraft found"
- The HTML structure may have changed
- Check `page-source.html` to see the actual page structure
- Update parsing logic in `scripts/migrate-aircraft.ts`
- Consider using the manual import method instead

### Image download failures
- Some images may be behind authentication or have changed URLs
- The aircraft will still be created, just without an image
- You can manually upload images later through the admin panel

### Duplicate slugs
- If you run the migration twice, you may get slug conflicts
- Either delete the old entries first, or modify the slug generation logic

## Post-Migration

After successful migration:

1. Review each aircraft listing in the admin panel
2. Add any missing information
3. Upload additional images if needed
4. Update descriptions and features
5. Set appropriate status (available, sold, etc.)
6. Mark important listings as "featured"

## Need Help?

If you encounter issues:

1. Check the console output for specific error messages
2. Review the generated `page-source.html` (for automated migration)
3. Verify your Supabase credentials and permissions
4. Check that the `aircraft-images` storage bucket exists and is publicly accessible

## Scripts Reference

- `npm run migrate-aircraft` - Run automated migration from old website
- `npm run import-aircraft <file>` - Import aircraft from JSON file
- Template file: `scripts/aircraft-data-template.json`
