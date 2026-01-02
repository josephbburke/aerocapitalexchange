# Inquiry System - Quick Start Guide

## What Was Built

A complete contact and inquiry management system with:

### Core Features
- Contact form on `/contact` page
- Reusable inquiry form component for aircraft pages
- API routes with rate limiting (5 requests/15 min)
- Email notifications (admin + user confirmations)
- Database integration with RLS policies
- Full TypeScript support
- Comprehensive validation

## Files Created/Modified

### New Files Created:
```
lib/utils/rate-limit.ts          - Rate limiting utility
lib/utils/email.ts                - Email notification system
app/api/inquiries/route.ts        - API endpoint (POST/GET)
components/contact/inquiry-form.tsx - Reusable inquiry form
supabase/migrations/20260102000000_create_inquiries_table.sql
INQUIRY-SYSTEM-GUIDE.md           - Full documentation
```

### Modified Files:
```
schemas/inquiry.ts                - Enhanced validation schema
lib/api/inquiries.ts             - API client functions
components/contact/contact-form.tsx - Updated with new features
```

## Quick Usage Examples

### 1. Contact Page (Already Implemented)
The contact page at `/contact` is ready to use with the `ContactForm` component.

### 2. Aircraft Detail Page
Add inquiry form to any aircraft detail page:

```tsx
import { InquiryForm } from '@/components/contact/inquiry-form'

export default function AircraftDetailPage({ params }) {
  const aircraft = await getAircraft(params.slug)

  return (
    <div>
      {/* Aircraft details... */}

      <InquiryForm
        aircraftId={aircraft.id}
        aircraftTitle={aircraft.title}
        inquiryType="aircraft"
        compact={false}
      />
    </div>
  )
}
```

### 3. Sidebar Inquiry Widget
Use compact mode for sidebars:

```tsx
<InquiryForm
  aircraftId={aircraft.id}
  aircraftTitle={aircraft.title}
  compact={true}
  showCompanyName={false}
  title="Quick Inquiry"
/>
```

### 4. Custom Inquiry Form
For financing or other custom inquiries:

```tsx
<InquiryForm
  inquiryType="financing"
  title="Financing Inquiry"
  description="Get pre-qualified today"
  showInquiryType={false}
/>
```

## Database Setup

### Option 1: Using Supabase CLI (Recommended)
```bash
# Apply migration
supabase db push
```

### Option 2: Manual Setup
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents from `supabase/migrations/20260102000000_create_inquiries_table.sql`
3. Run the SQL

## Environment Setup

The system uses existing environment variables. To enable email notifications in production, add:

```env
# .env.local
ADMIN_EMAIL=info@aerocapitalexchange.com
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Get from resend.com
```

## Testing Checklist

### Basic Test (5 minutes)
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/contact`
3. Fill out form with test data
4. Submit and verify:
   - Success message appears
   - Console shows email notifications
5. Check Supabase dashboard for saved inquiry

### Rate Limit Test
1. Submit form 6 times rapidly
2. Verify 6th submission shows rate limit error
3. Check response headers for rate limit info

### Validation Test
1. Try submitting with:
   - Empty required fields
   - Invalid email
   - Short message (<10 chars)
2. Verify error messages display

## API Endpoints

### Create Inquiry
```typescript
POST /api/inquiries

// Request
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-123-4567",
  "subject": "Aircraft Inquiry",
  "message": "I'm interested in...",
  "inquiry_type": "aircraft",
  "aircraft_id": "uuid-here"
}

// Response
{
  "success": true,
  "inquiry": { "id": "...", "created_at": "..." }
}
```

### Get Inquiries (Authenticated)
```typescript
GET /api/inquiries

// Response
{
  "success": true,
  "inquiries": [...]
}
```

## Rate Limiting

Current limits:
- Contact forms: 5 requests per 15 minutes
- Based on IP address
- Returns 429 with retry-after header when exceeded

## Email Notifications

### Development
- Uses console.log
- Check terminal for formatted email output

### Production Setup
1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ADMIN_EMAIL=info@aerocapitalexchange.com
   ```
4. Uncomment email sending code in `lib/utils/email.ts`

## Component Props Reference

### InquiryForm Props

```typescript
interface InquiryFormProps {
  aircraftId?: string           // Aircraft UUID
  aircraftTitle?: string        // Pre-fill subject
  inquiryType?: 'aircraft' | 'financing' | 'general' | 'partnership'
  defaultSubject?: string       // Custom default subject
  title?: string                // Custom form title
  description?: string          // Custom description
  compact?: boolean             // Compact mode for sidebars
  showCompanyName?: boolean     // Show company field (default: true)
  showInquiryType?: boolean     // Show type selector (default: true)
}
```

## Database Queries

### View Recent Inquiries
```sql
SELECT id, full_name, email, subject, status, created_at
FROM public.inquiries
ORDER BY created_at DESC
LIMIT 10;
```

### View Statistics
```sql
SELECT * FROM public.inquiry_statistics;
```

### Update Inquiry Status
```sql
UPDATE public.inquiries
SET status = 'responded', responded_at = NOW()
WHERE id = 'inquiry-uuid-here';
```

## Common Issues

### "Rate limit exceeded"
- Wait 15 minutes or restart dev server to clear
- In production, consider Redis-based rate limiting

### "Database error"
- Verify migration ran successfully
- Check Supabase connection in `.env.local`
- Verify RLS policies allow insertion

### "Form validation fails"
- Check all required fields are filled
- Email must be valid format
- Message must be 10-2000 characters

## Next Steps

1. **Add to Aircraft Pages**: Integrate InquiryForm in aircraft detail pages
2. **Admin Dashboard**: Build inquiry management interface
3. **Email Service**: Set up Resend or SendGrid for production
4. **Monitoring**: Add error tracking (Sentry)
5. **Analytics**: Track conversion rates
6. **Spam Protection**: Add reCAPTCHA if needed

## Support

For detailed documentation, see `INQUIRY-SYSTEM-GUIDE.md`

For issues:
1. Check console for errors
2. Verify database migration ran
3. Check environment variables
4. Review API response in Network tab
