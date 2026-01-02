# Security Quick Reference Guide

**Last Updated:** January 2, 2026

This is a quick reference for the security implementation in AeroCapitalExchange.

## Security Headers Overview

All security headers are configured and automatically applied to every request.

### Configuration Files

1. **`next.config.ts`** - Primary security headers
   - Content-Security-Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security (HSTS)
   - Referrer-Policy
   - Permissions-Policy
   - X-XSS-Protection

2. **`middleware.ts`** - Additional runtime headers
   - Cross-Origin policies (COEP, COOP, CORP)
   - X-Download-Options
   - X-Robots-Tag
   - Nonce generation for CSP

## Testing Security Headers

### Local Testing

```bash
# Start the development server
npm run dev

# In another terminal, run the security test
npx tsx scripts/test-security-headers.ts http://localhost:3000
```

### Production Testing

```bash
# Test your production URL
npx tsx scripts/test-security-headers.ts https://your-domain.com

# Or use online tools:
# - https://securityheaders.com
# - https://observatory.mozilla.org
```

## Environment Variables

### Public Variables (Client-Side)
These are safe to expose and use `NEXT_PUBLIC_` prefix:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Aero Capital Exchange
```

### Server-Only Variables (NEVER expose to client)

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Only for server-side scripts
```

**CRITICAL:** Never use `SUPABASE_SERVICE_ROLE_KEY` in:
- Client components
- API routes (unless absolutely necessary and carefully secured)
- Middleware
- Server components that might leak to client

## Protected Routes

### Admin Routes (`/admin/*`)
- Requires authentication
- Requires `admin` or `super_admin` role
- Redirects to `/auth/login` if not authenticated
- Redirects to `/dashboard` if not authorized

### Dashboard Routes (`/dashboard/*`)
- Requires authentication
- Redirects to `/auth/login` if not authenticated

### Auth Routes (`/auth/*`)
- Public for non-authenticated users
- Redirects to `/dashboard` if already authenticated

### Public Routes
- `/` - Home
- `/aircraft` - Aircraft listing
- `/aircraft/[slug]` - Aircraft details
- `/contact` - Contact page
- Static assets

## Content Security Policy (CSP)

Current CSP allows:

### Scripts
- Same origin (`'self'`)
- Inline scripts (`'unsafe-inline'` - required by Next.js)
- Eval (`'unsafe-eval'` - required by Next.js dev)
- Google Sign-In domains

### Styles
- Same origin (`'self'`)
- Inline styles (`'unsafe-inline'` - required by Next.js)

### Images
- Same origin (`'self'`)
- Data URIs (`data:`)
- All HTTPS sources (`https:`)
- Blob URLs (`blob:`)

### Connections
- Same origin (`'self'`)
- Supabase domains (`https://*.supabase.co`, `wss://*.supabase.co`)
- Google accounts (`https://accounts.google.com`)

### Frames
- Same origin (`'self'`)
- Google Sign-In (`https://accounts.google.com`)

### Upgrade Insecure Requests
- All HTTP requests automatically upgraded to HTTPS in production

## Common Security Tasks

### Adding a New External Domain

If you need to load resources from a new external domain:

1. Update `next.config.ts` CSP policy:
```typescript
"connect-src 'self' https://your-new-domain.com"
```

2. Test locally to ensure it works
3. Test CSP violations in browser console (F12)

### Updating Security Headers

1. Edit `next.config.ts` for global headers
2. Edit `middleware.ts` for runtime headers
3. Restart dev server
4. Run test script: `npx tsx scripts/test-security-headers.ts`

### Checking for CSP Violations

In browser DevTools (F12):
1. Open Console tab
2. Look for CSP violation warnings
3. Adjust policy if needed for legitimate resources

## Security Checklist Before Production

- [ ] Test all security headers are present
- [ ] No CSP violations in browser console
- [ ] Environment variables properly configured in hosting
- [ ] `.env.local` not committed to git
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Test admin route protection
- [ ] Test authentication flows
- [ ] Run security scanner on production URL
- [ ] Review Supabase RLS policies
- [ ] Verify no sensitive data in client bundle

## Emergency Response

### If API Key is Exposed

1. **Immediately** go to Supabase Dashboard
2. Navigate to Settings → API
3. Click "Reset" on the exposed key
4. Update environment variables everywhere:
   - Local `.env.local`
   - Vercel project settings
   - CI/CD pipelines
5. Redeploy application
6. Review access logs for unauthorized usage

### If Security Vulnerability Found

1. Deploy fix immediately
2. Review logs for exploitation attempts
3. Notify users if data was compromised
4. Document incident for future prevention

## Resources

- **Full Documentation:** `SECURITY.md`
- **Production Checklist:** `PRODUCTION-LAUNCH-CHECKLIST.md`
- **Test Script:** `scripts/test-security-headers.ts`
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Next.js Security:** https://nextjs.org/docs/app/building-your-application/configuring/security-headers
- **Supabase Security:** https://supabase.com/docs/guides/platform/going-into-prod

## Support

For security concerns, refer to `SECURITY.md` for incident response procedures.
