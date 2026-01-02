import { z } from 'zod'

// Inquiry form schema with comprehensive validation
export const inquiryFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company_name: z.string().max(100, 'Company name is too long').optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
  preferred_contact_method: z.enum(['email', 'phone', 'either']).optional(),
  inquiry_type: z.enum(['aircraft', 'financing', 'general', 'partnership']).optional(),
  aircraft_id: z.string().uuid().optional(),
})

export type InquiryFormData = z.infer<typeof inquiryFormSchema>

// Validation refinement for phone numbers
export const inquiryFormSchemaWithPhoneValidation = inquiryFormSchema.refine(
  (data) => {
    if (data.phone && data.phone.length > 0) {
      // Remove non-digit characters for validation
      const digitsOnly = data.phone.replace(/\D/g, '')
      return digitsOnly.length >= 10
    }
    return true
  },
  {
    message: 'Phone number must be at least 10 digits',
    path: ['phone'],
  }
)

// API request schema for server-side validation
export const inquiryApiSchema = inquiryFormSchema.extend({
  // Additional server-only fields
  source: z.string().optional(),
  user_agent: z.string().optional(),
  ip_address: z.string().optional(),
})
