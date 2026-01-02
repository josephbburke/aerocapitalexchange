import { z } from 'zod'

export const aircraftFormSchema = z.object({
  // Basic Information
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  status: z.enum(['available', 'sold', 'pending', 'draft']),

  // Aircraft Details
  manufacturer: z.string().min(2, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),
  year_manufactured: z.number().min(1900).max(new Date().getFullYear() + 1),
  registration_number: z.string().optional(),
  serial_number: z.string().optional(),

  // Categorization
  category: z.enum(['jet', 'turboprop', 'helicopter', 'piston']),
  aircraft_type: z.string().optional(),

  // Specifications
  total_time_hours: z.number().min(0).optional(),
  engines: z.number().min(1).max(8).optional(),
  passengers_capacity: z.number().min(1).max(1000).optional(),
  max_range_nm: z.number().min(0).optional(),
  max_speed_kts: z.number().min(0).optional(),
  cruise_speed_kts: z.number().min(0).optional(),
  max_altitude_ft: z.number().min(0).optional(),

  // Pricing
  price: z.number().min(0).optional(),
  price_currency: z.string().optional(),
  is_price_negotiable: z.boolean().optional(),

  // Content
  description: z.string().optional(),
  features: z.array(z.string()).optional(),

  // SEO
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  featured: z.boolean().optional(),
})

export type AircraftFormData = z.infer<typeof aircraftFormSchema>
