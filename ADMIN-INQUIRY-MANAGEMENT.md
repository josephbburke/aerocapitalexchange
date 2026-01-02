# Admin Inquiry Management System

## Overview

A comprehensive admin interface for managing customer inquiries with advanced filtering, search, and CRUD operations. The system provides a full-featured inquiry management dashboard protected by admin authentication.

## Features Implemented

### 1. Admin Inquiries Page (`/admin/inquiries`)

**Location**: `app/admin/inquiries/page.tsx`

#### Key Features:
- **Real-time Statistics Dashboard**
  - Total inquiries count
  - New inquiries (highlighted in blue)
  - In Progress count (highlighted in yellow)
  - Responded count (highlighted in green)
  - Closed inquiries count

- **Advanced Filtering**
  - Filter by status: All, New, In Progress, Responded, Closed, Spam
  - Filter by priority: All, Low, Medium, High, Urgent
  - Filter by type: All, Aircraft, Financing, General, Partnership
  - Real-time search across name, email, phone, company, subject, and message

- **Sorting Capabilities**
  - Sort by date (newest/oldest)
  - Sort by priority (low to high / high to low)
  - Toggle ascending/descending order

- **Quick Actions**
  - Mark as "In Progress" (for new inquiries)
  - Mark as "Responded" (for in-progress inquiries)
  - View full details in modal
  - Delete inquiry
  - Export filtered results to CSV

- **Responsive Design**
  - Mobile-friendly card layout
  - Adaptive grid for filters
  - Touch-friendly buttons and controls

### 2. Inquiry Detail Modal

**Location**: `components/admin/inquiry-detail-modal.tsx`

#### Features:
- **Full Contact Information**
  - Name, email (clickable mailto link)
  - Phone (clickable tel link)
  - Company name (if provided)

- **Inquiry Details**
  - Subject and full message
  - Inquiry type and priority
  - Related aircraft (with link to listing)
  - Source information

- **Status Management**
  - Update status via dropdown: New, In Progress, Responded, Closed, Spam
  - Update priority via dropdown: Low, Medium, High, Urgent
  - Real-time updates

- **Timeline Information**
  - Received timestamp
  - Responded timestamp (if applicable)

- **Admin Notes**
  - Internal notes field for team communication
  - Save notes functionality
  - Persistent storage

- **Actions**
  - Delete inquiry with confirmation
  - Close modal
  - All changes auto-save

### 3. Enhanced API Functions

**Location**: `lib/api/inquiries.ts`

New functions added:
```typescript
// Update any inquiry field
updateInquiry(id, updates)

// Update priority specifically
updateInquiryPriority(id, priority)

// Delete inquiry
deleteInquiry(id)
```

### 4. UI Components Added

#### Dialog Component (`components/ui/dialog.tsx`)
- Modal overlay for inquiry details
- Accessible with keyboard navigation
- Smooth animations
- Click outside to close

#### Select Component (`components/ui/select.tsx`)
- Dropdown for filters and status updates
- Keyboard accessible
- Search-friendly
- Styled to match design system

## Authentication & Security

- **Route Protection**: All `/admin/inquiries` routes are protected by middleware
- **Admin Role Required**: Only users with `admin` or `super_admin` role can access
- **Automatic Redirect**: Unauthenticated users redirected to login with return URL
- **Non-admin Users**: Redirected to dashboard if they try to access admin pages

**Middleware**: `middleware.ts` (lines 61-78)

## Usage Guide

### Accessing Inquiry Management

1. **From Admin Dashboard**:
   - Navigate to `/admin`
   - Click on "Inquiries" card
   - Shows badge with new inquiry count

2. **Direct URL**:
   - Navigate to `/admin/inquiries`

### Managing Inquiries

#### Filtering & Search

1. **Search**: Type in search box to filter by:
   - Customer name
   - Email address
   - Phone number
   - Company name
   - Subject line
   - Message content

2. **Status Filter**: Select from dropdown:
   - All Statuses
   - New (requires attention)
   - In Progress (being worked on)
   - Responded (customer contacted)
   - Closed (resolved)
   - Spam (marked as spam)

3. **Priority Filter**: Select from dropdown:
   - All Priorities
   - Urgent
   - High
   - Medium
   - Low

4. **Type Filter**: Select from dropdown:
   - All Types
   - Aircraft (product inquiries)
   - Financing (financing questions)
   - General (general inquiries)
   - Partnership (business partnerships)

5. **Clear Filters**: Click "Clear Filters" to reset all filters

#### Sorting Results

1. Click "Date" button to sort by date
2. Click "Priority" button to sort by priority
3. Click again to toggle ascending/descending order
4. Active sort shows up/down arrow indicator

#### Quick Status Updates

1. **New Inquiries**: Click "Start Processing" to mark as In Progress
2. **In Progress**: Click "Mark Responded" when customer is contacted
3. Status updates immediately without page reload

#### Viewing Full Details

1. Click "View Details" button on any inquiry
2. Modal opens with complete information
3. Update status/priority via dropdowns
4. Add/edit admin notes
5. Delete inquiry if needed
6. Click "Close" or press ESC to exit

#### Exporting Data

1. Apply filters as needed
2. Click "Export CSV" button
3. CSV file downloads with filtered results
4. Includes: Date, Name, Email, Phone, Company, Type, Subject, Status, Priority, Message

#### Deleting Inquiries

1. **From List**: Click trash icon, confirm deletion
2. **From Modal**: Click "Delete Inquiry" button, confirm deletion
3. Deletion is permanent and cannot be undone

## Data Structure

### Inquiry Fields

```typescript
{
  id: string                    // UUID
  user_id: string | null       // Linked user (if logged in)
  full_name: string            // Customer name
  email: string                // Contact email
  phone: string | null         // Contact phone
  company_name: string | null  // Company name
  inquiry_type: 'aircraft' | 'financing' | 'general' | 'partnership'
  aircraft_id: string | null   // Related aircraft ID
  subject: string              // Inquiry subject
  message: string              // Full message
  status: 'new' | 'in_progress' | 'responded' | 'closed' | 'spam'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: string | null   // Admin user ID (future use)
  source: string | null        // Traffic source
  ip_address: string | null    // Customer IP
  user_agent: string | null    // Browser info
  admin_notes: string | null   // Internal notes
  responded_at: string | null  // Response timestamp
  created_at: string           // Creation timestamp
  updated_at: string           // Last update timestamp
}
```

## Visual Indicators

### Status Colors
- **New**: Blue border and badge
- **In Progress**: Yellow badge
- **Responded**: Green badge
- **Closed**: Gray badge
- **Spam**: Red badge

### Priority Colors
- **Urgent**: Red
- **High**: Orange
- **Medium**: Yellow
- **Low**: Gray

## Mobile Responsiveness

- Grid layout adapts: 5 columns (desktop) → 3 columns (tablet) → 2 columns (mobile)
- Filters stack vertically on small screens
- Touch-friendly buttons (44px minimum)
- Scrollable inquiry list
- Modal scales to screen size
- Horizontal scrolling for filter tabs

## Performance Optimizations

1. **React Query Caching**: Inquiries cached for fast subsequent loads
2. **Optimistic Updates**: UI updates immediately, syncs with server
3. **Lazy Loading**: Modal only renders when opened
4. **Memoization**: Filtered/sorted results memoized to prevent unnecessary recalculation
5. **Efficient Filtering**: Client-side filtering for instant results

## Dependencies Installed

```json
{
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-select": "latest"
}
```

## File Structure

```
app/admin/inquiries/
  └── page.tsx                          # Main inquiry management page

components/admin/
  └── inquiry-detail-modal.tsx          # Detail modal component

components/ui/
  ├── dialog.tsx                        # Dialog/modal component
  └── select.tsx                        # Select dropdown component

lib/api/
  └── inquiries.ts                      # Updated with CRUD functions
```

## Future Enhancements

Potential features for future implementation:

1. **Bulk Actions**
   - Select multiple inquiries
   - Bulk status updates
   - Bulk delete

2. **Assignment System**
   - Assign inquiries to specific admins
   - Track who's working on what
   - Workload distribution

3. **Email Integration**
   - Reply to inquiries directly from admin panel
   - Email templates
   - Auto-responses

4. **Advanced Analytics**
   - Response time metrics
   - Conversion tracking
   - Source analysis

5. **Notifications**
   - Real-time notifications for new inquiries
   - Email alerts for urgent inquiries
   - Desktop notifications

6. **Tags & Labels**
   - Custom tags for categorization
   - Quick filters by tag
   - Color-coded labels

7. **Activity History**
   - Track all changes to inquiry
   - Admin action log
   - Audit trail

8. **Follow-up Reminders**
   - Set follow-up dates
   - Reminder notifications
   - Overdue inquiry alerts

## Troubleshooting

### Common Issues

1. **Inquiries Not Loading**
   - Check database connection
   - Verify Supabase credentials in `.env.local`
   - Check browser console for errors

2. **Status Updates Not Saving**
   - Check network tab for failed requests
   - Verify user has admin permissions
   - Check Supabase RLS policies

3. **Search Not Working**
   - Ensure JavaScript is enabled
   - Clear browser cache
   - Check React Query DevTools

4. **Modal Not Opening**
   - Check browser console for errors
   - Verify Dialog component is imported correctly
   - Check z-index conflicts

## Best Practices

1. **Respond Promptly**: Check new inquiries daily
2. **Update Status**: Keep status current for team visibility
3. **Use Notes**: Document important details in admin notes
4. **Set Priority**: Triage inquiries by priority
5. **Regular Cleanup**: Archive or delete old closed inquiries
6. **Export Regularly**: Backup inquiry data via CSV export

## Support

For issues or questions about the inquiry management system:
- Check this documentation
- Review the codebase comments
- Test in development environment first
- Check Supabase logs for database errors
