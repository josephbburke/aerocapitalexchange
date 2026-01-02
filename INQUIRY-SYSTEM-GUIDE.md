# Contact & Inquiry System Documentation

## Overview

The AeroCapitalExchange Contact & Inquiry System is a comprehensive solution for handling customer inquiries with the following features:

- **Form Validation**: Zod schema-based validation for data integrity
- **Rate Limiting**: Protection against spam and abuse (5 requests per 15 minutes)
- **Email Notifications**: Automatic notifications to admin and user confirmations
- **Database Integration**: Full Supabase integration with RLS policies
- **Reusable Components**: Flexible form components for different use cases
- **Type Safety**: Full TypeScript support throughout

## Architecture

### Components

#### 1. **ContactForm** (`components/contact/contact-form.tsx`)
The main contact form used on the `/contact` page.

**Features:**
- Inquiry type selection (general, financing, aircraft, partnership)
- Preferred contact method selection
- Auto-fills user data if authenticated
- Success/error messaging

**Usage:**
```tsx
import { ContactForm } from '@/components/contact/contact-form'

export default function ContactPage() {
  return <ContactForm />
}
```

#### 2. **InquiryForm** (`components/contact/inquiry-form.tsx`)
A reusable inquiry form component that can be embedded anywhere, including aircraft detail pages.

**Features:**
- Configurable for different inquiry types
- Can be pre-filled with aircraft information
- Compact mode for sidebars
- Customizable title and description
- Optional fields (company name, inquiry type)

**Usage Examples:**

**Basic Usage:**
```tsx
import { InquiryForm } from '@/components/contact/inquiry-form'

export default function AircraftDetailPage() {
  return (
    <InquiryForm
      aircraftId="123e4567-e89b-12d3-a456-426614174000"
      aircraftTitle="Gulfstream G650"
      inquiryType="aircraft"
    />
  )
}
```

**Compact Mode (for sidebars):**
```tsx
<InquiryForm
  aircraftId={aircraft.id}
  aircraftTitle={aircraft.title}
  compact={true}
  showCompanyName={false}
/>
```

**General Inquiry:**
```tsx
<InquiryForm
  inquiryType="financing"
  title="Financing Inquiry"
  description="Ask us about our flexible financing options"
  showInquiryType={false}
/>
```

### API Routes

#### POST `/api/inquiries`

Creates a new inquiry with rate limiting and email notifications.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "company_name": "Aviation Corp",
  "subject": "Inquiry about Gulfstream G650",
  "message": "I'm interested in learning more...",
  "inquiry_type": "aircraft",
  "aircraft_id": "123e4567-e89b-12d3-a456-426614174000",
  "preferred_contact_method": "email"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "inquiry": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "created_at": "2026-01-02T10:30:00Z"
  }
}
```

**Response (Rate Limited - 429):**
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again after 10:45:00 AM.",
  "retryAfter": "2026-01-02T10:45:00Z"
}
```

**Rate Limit Headers:**
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: When the rate limit resets

#### GET `/api/inquiries`

Retrieves inquiries (authenticated users only).

**Authorization:**
- Regular users: See only their own inquiries
- Admins: See all inquiries

**Response:**
```json
{
  "success": true,
  "inquiries": [
    {
      "id": "...",
      "full_name": "John Doe",
      "email": "john@example.com",
      "subject": "Inquiry about...",
      "status": "new",
      "created_at": "2026-01-02T10:30:00Z",
      "aircraft": {
        "title": "Gulfstream G650",
        "slug": "gulfstream-g650"
      }
    }
  ]
}
```

### Database Schema

The `inquiries` table is defined in `types/database.ts` and created via migration at `supabase/migrations/20260102000000_create_inquiries_table.sql`.

**Key Fields:**
- `id`: UUID primary key
- `user_id`: Reference to authenticated user (nullable)
- `full_name`, `email`, `phone`, `company_name`: Contact information
- `inquiry_type`: Type of inquiry (aircraft, financing, general, partnership)
- `aircraft_id`: Reference to aircraft (nullable)
- `subject`, `message`: Inquiry content
- `status`: Current status (new, in_progress, responded, closed, spam)
- `priority`: Priority level (low, medium, high, urgent)
- `source`: Source of inquiry (website, mobile, etc.)
- `ip_address`, `user_agent`: Tracking information
- `admin_notes`: Internal notes (admin only)
- `created_at`, `updated_at`, `responded_at`: Timestamps

**Indexes:**
- User ID, Aircraft ID, Status, Priority, Inquiry Type
- Created Date (DESC), Email, Assigned To

**Row Level Security (RLS):**
- Users can view their own inquiries
- Admins can view and update all inquiries
- Anyone (authenticated or not) can create inquiries
- Only super admins can delete inquiries

### Validation

Validation is handled by Zod schemas in `schemas/inquiry.ts`:

**Client-Side Schema (`inquiryFormSchema`):**
- `full_name`: 2-100 characters
- `email`: Valid email format
- `phone`: Optional, minimum 10 digits if provided
- `company_name`: Optional, max 100 characters
- `subject`: 5-200 characters
- `message`: 10-2000 characters
- `preferred_contact_method`: email, phone, or either
- `inquiry_type`: aircraft, financing, general, or partnership
- `aircraft_id`: Valid UUID (optional)

**Server-Side Schema (`inquiryApiSchema`):**
Extends client schema with additional fields:
- `source`: Inquiry source
- `user_agent`: Browser user agent
- `ip_address`: Client IP address

### Rate Limiting

Rate limiting is implemented in `lib/utils/rate-limit.ts`:

**Configuration:**
- **Contact Forms**: 5 requests per 15 minutes
- **General API**: 30 requests per minute
- **Auth Endpoints**: 5 requests per 15 minutes
- **Search/Browse**: 60 requests per minute

**Implementation:**
- In-memory storage for development
- Automatic cleanup of expired entries
- IP-based identification
- Supports various proxy headers (X-Forwarded-For, X-Real-IP, CF-Connecting-IP)

**Production Recommendations:**
For production, consider using:
- Redis for distributed rate limiting
- Dedicated rate limiting service (e.g., Upstash Rate Limit)
- CDN-level rate limiting (e.g., Cloudflare)

### Email Notifications

Email functionality is in `lib/utils/email.ts`:

**Current Implementation:**
- Console logging for development
- Professional HTML email templates
- Admin notifications with inquiry details
- User confirmation emails

**Production Setup:**
To enable real email sending, integrate with:

**Option 1: Resend (Recommended)**
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'noreply@aerocapitalexchange.com',
  to: data.to,
  subject: data.subject,
  html: data.body,
  replyTo: data.replyTo,
})
```

**Option 2: SendGrid**
```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

await sgMail.send({
  to: data.to,
  from: 'noreply@aerocapitalexchange.com',
  subject: data.subject,
  html: data.body,
})
```

**Environment Variables:**
```env
# Add to .env.local
ADMIN_EMAIL=info@aerocapitalexchange.com
RESEND_API_KEY=re_xxxxxxxxxxxxx
# or
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### API Functions

Client-side API functions are in `lib/api/inquiries.ts`:

**createInquiry** (Recommended)
Uses API route with rate limiting and notifications:
```typescript
import { createInquiry } from '@/lib/api/inquiries'

const inquiry = await createInquiry(
  formData,
  aircraftId, // optional
  userId      // optional
)
```

**createInquiryDirect**
Direct database access (for internal use):
```typescript
import { createInquiryDirect } from '@/lib/api/inquiries'

const inquiry = await createInquiryDirect(formData, aircraftId, userId)
```

**Other Functions:**
- `getUserInquiries(userId)`: Get user's inquiries
- `getInquiryById(id)`: Get specific inquiry
- `getAllInquiries()`: Get all inquiries (admin)
- `updateInquiryStatus(id, status)`: Update status
- `updateInquiryNotes(id, notes)`: Add admin notes
- `updateInquiry(id, updates)`: General update
- `updateInquiryPriority(id, priority)`: Update priority
- `deleteInquiry(id)`: Delete inquiry (super admin)

## Testing

### Manual Testing Checklist

1. **Contact Form Submission**
   - [ ] Navigate to `/contact`
   - [ ] Fill out all required fields
   - [ ] Submit form
   - [ ] Verify success message appears
   - [ ] Check console for email notifications
   - [ ] Verify inquiry saved in database

2. **Rate Limiting**
   - [ ] Submit 6 inquiries rapidly
   - [ ] Verify 6th request is rate limited
   - [ ] Check rate limit headers in response
   - [ ] Wait 15 minutes and verify limit resets

3. **Validation**
   - [ ] Submit with empty required fields
   - [ ] Submit with invalid email
   - [ ] Submit with short message (<10 chars)
   - [ ] Verify all validation errors display correctly

4. **Aircraft Inquiry**
   - [ ] Create InquiryForm with aircraftId
   - [ ] Verify aircraft info pre-fills
   - [ ] Submit inquiry
   - [ ] Verify aircraft_id saved correctly

5. **Authentication**
   - [ ] Test as unauthenticated user
   - [ ] Test as authenticated user (verify pre-fill)
   - [ ] Test as admin (verify can see all inquiries)

### Database Verification

```sql
-- Check inquiries table exists
SELECT * FROM public.inquiries LIMIT 1;

-- View recent inquiries
SELECT id, full_name, email, subject, status, created_at
FROM public.inquiries
ORDER BY created_at DESC
LIMIT 10;

-- Check inquiry statistics
SELECT * FROM public.inquiry_statistics;
```

## Deployment

### Environment Variables

Required environment variables (already in `.env.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site
NEXT_PUBLIC_SITE_URL=https://aerocapitalexchange.com
NEXT_PUBLIC_SITE_NAME=Aero Capital Exchange

# Email (add these)
ADMIN_EMAIL=info@aerocapitalexchange.com
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Database Setup

1. Run the migration:
```bash
# Using Supabase CLI
supabase db push

# Or apply manually in Supabase Dashboard SQL Editor
# Copy contents of supabase/migrations/20260102000000_create_inquiries_table.sql
```

2. Verify RLS policies are enabled:
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'inquiries';
```

### Production Considerations

1. **Email Service**: Replace console.log with actual email service
2. **Rate Limiting**: Consider Redis for distributed environments
3. **Monitoring**: Add logging and error tracking (e.g., Sentry)
4. **Analytics**: Track inquiry conversion rates
5. **Spam Prevention**: Consider adding reCAPTCHA
6. **Webhooks**: Add webhook notifications for real-time alerts

## Troubleshooting

### Common Issues

**Issue: Inquiries not saving to database**
- Check Supabase connection in `.env.local`
- Verify migration ran successfully
- Check RLS policies allow insertion

**Issue: Rate limit not working**
- Verify IP address is being captured correctly
- Check rate limit configuration in API route
- Clear rate limit store: restart dev server

**Issue: Emails not sending**
- Check console for email notifications (dev mode)
- Verify email service credentials in production
- Check email template formatting

**Issue: Form validation errors**
- Check Zod schema matches form fields
- Verify field names match schema
- Check error messages display correctly

## Future Enhancements

- [ ] Real-time notifications using Supabase Realtime
- [ ] Admin dashboard for managing inquiries
- [ ] Automated assignment based on inquiry type
- [ ] Email threading for conversations
- [ ] SMS notifications option
- [ ] Integration with CRM systems
- [ ] Advanced spam detection (AI-based)
- [ ] Analytics and reporting dashboard
- [ ] Multi-language support
- [ ] File attachments support
