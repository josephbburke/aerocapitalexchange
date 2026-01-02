# Admin Inquiry Management - Quick Reference

## Quick Access

**URL**: `/admin/inquiries`

**From Dashboard**: Click "Inquiries" card on `/admin`

## At a Glance

### Status Colors
- 🔵 **Blue** = New (needs attention)
- 🟡 **Yellow** = In Progress
- 🟢 **Green** = Responded
- ⚫ **Gray** = Closed
- 🔴 **Red** = Spam

### Priority Levels
- 🔴 **Urgent** - Handle immediately
- 🟠 **High** - Handle today
- 🟡 **Medium** - Handle this week
- ⚫ **Low** - Handle when possible

## Common Tasks

### 1. Check New Inquiries
1. Navigate to `/admin/inquiries`
2. Look at blue "New" count in stats
3. Click "New" filter tab
4. Review all new inquiries

### 2. Respond to Inquiry
1. Click "View Details" on inquiry
2. Read full message
3. Contact customer via email/phone
4. Update status to "Responded"
5. Add notes about conversation

### 3. Search for Inquiry
1. Use search box at top
2. Type: name, email, or keywords
3. Results filter automatically

### 4. Update Status (Quick)
- **New inquiry** → Click "Start Processing"
- **Working on it** → Click "Mark Responded"
- **Need custom status** → Click "View Details" → Change dropdown

### 5. Export Data
1. Apply desired filters
2. Click "Export CSV" button
3. File downloads automatically

### 6. Delete Inquiry
1. Click trash icon OR
2. View Details → "Delete Inquiry"
3. Confirm deletion

## Keyboard Shortcuts

- `ESC` - Close modal
- `Tab` - Navigate form fields
- `Enter` - Submit/Confirm
- `Space` - Toggle dropdown

## Filter Combinations

### Common Filters

**All New Aircraft Inquiries**
- Status: New
- Type: Aircraft

**Urgent Items Today**
- Priority: Urgent
- Status: New or In Progress

**Recently Responded**
- Status: Responded
- Sort: Date (newest first)

**Customer Follow-up Needed**
- Status: In Progress
- Sort: Date (oldest first)

## Tips & Best Practices

1. **Check Daily**: Review new inquiries at least once per day
2. **Update Promptly**: Change status as you work on inquiries
3. **Use Notes**: Document phone calls and important details
4. **Set Priority**: Mark urgent inquiries immediately
5. **Clean Up**: Close resolved inquiries weekly

## Status Workflow

```
New → In Progress → Responded → Closed
     ↓
    Spam (if spam)
```

### When to Use Each Status

- **New**: Just received, not yet reviewed
- **In Progress**: Currently working on it
- **Responded**: Customer has been contacted
- **Closed**: Issue resolved, no further action
- **Spam**: Not a legitimate inquiry

## Admin Notes Best Practices

Include:
- Date and time of contact
- Method used (email/phone)
- Summary of conversation
- Next steps or follow-up needed
- Any promises made to customer

Example:
```
1/2/2026 2:30 PM - Called customer
Discussed financing options
Sending quote via email
Follow up in 3 days if no response
```

## Mobile Usage

- Swipe to scroll inquiry list
- Tap stats cards for quick filters
- Use dropdown menus for filters
- Long-press email/phone for copy

## Troubleshooting

**Can't see inquiries?**
- Refresh page (F5)
- Check you're logged in as admin
- Clear browser cache

**Status not updating?**
- Check internet connection
- Wait 2 seconds and try again
- Refresh page to see changes

**Export not working?**
- Ensure you have at least 1 inquiry
- Check browser allows downloads
- Disable popup blocker

## Contact Info Quick Actions

- **Email**: Click email to open mail client
- **Phone**: Click phone number to dial (mobile)
- **Aircraft**: Click aircraft link to view listing

## Need Help?

1. Read full documentation: `ADMIN-INQUIRY-MANAGEMENT.md`
2. Check database logs in Supabase
3. Review browser console for errors
4. Contact technical support
