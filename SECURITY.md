# Security Configuration

## Overview

This document outlines the security measures implemented in the AeroCapitalExchange Next.js application. These configurations are critical for production deployment and protect against common web vulnerabilities.

## Security Headers

### Implemented in next.config.ts

The application implements comprehensive security headers for all routes:

#### 1. Content Security Policy (CSP)
**Purpose:** Prevents XSS attacks, code injection, and unauthorized resource loading.

```
Content-Security-Policy:
  - default-src 'self'
  - script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com
  - style-src 'self' 'unsafe-inline'
  - img-src 'self' data: https: blob:
  - font-src 'self' data:
  - connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com
  - frame-src 'self' https://accounts.google.com
  - object-src 'none'
  - base-uri 'self'
  - form-action 'self'
  - frame-ancestors 'none'
  - upgrade-insecure-requests
```

**Note:** The CSP allows 'unsafe-inline' for scripts and styles due to Next.js requirements. Consider implementing nonces or hashes for production.

#### 2. HTTP Strict Transport Security (HSTS)
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
**Purpose:** Forces HTTPS connections for 2 years, including all subdomains.

#### 3. X-Frame-Options
```
X-Frame-Options: DENY
```
**Purpose:** Prevents clickjacking attacks by disallowing the page from being embedded in frames/iframes.

#### 4. X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
**Purpose:** Prevents MIME type sniffing, reducing exposure to drive-by download attacks.

#### 5. X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
**Purpose:** Enables browser's XSS filtering and blocks page if attack detected.

#### 6. Referrer-Policy
```
Referrer-Policy: origin-when-cross-origin
```
**Purpose:** Controls how much referrer information is shared with external sites.

#### 7. Permissions-Policy
```
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```
**Purpose:** Disables unnecessary browser features and tracking (FLoC).

### Implemented in middleware.ts

Additional security headers added at the middleware level:

#### 8. Cross-Origin Policies
```
Cross-Origin-Embedder-Policy: credentialless
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```
**Purpose:** Prevents cross-origin attacks and isolates the browsing context.

#### 9. Download Protection
```
X-Download-Options: noopen
```
**Purpose:** Prevents Internet Explorer from executing downloads in the site's context.

#### 10. Search Engine Control
```
X-Robots-Tag: index, follow
```
**Purpose:** Controls search engine crawling behavior.

## Authentication & Authorization

### Middleware Protection

The middleware.ts file implements route-based authentication:

#### Protected Routes

1. **Admin Routes (/admin/\*)**
   - Requires authenticated user
   - Requires 'admin' or 'super_admin' role in profiles table
   - Unauthorized users redirected to /dashboard
   - Unauthenticated users redirected to /auth/login with return URL

2. **Dashboard Routes (/dashboard/\*)**
   - Requires authenticated user
   - Any authenticated user can access
   - Unauthenticated users redirected to /auth/login with return URL

3. **Auth Routes (/auth/\*)**
   - Public access for unauthenticated users
   - Authenticated users automatically redirected to /dashboard

#### Public Routes
- Home page (/)
- Aircraft listing (/aircraft)
- Aircraft details (/aircraft/[slug])
- Contact page (/contact)
- Static assets and images

### Session Management

- Sessions are managed via Supabase Auth with HTTP-only cookies
- Session tokens are refreshed on each request via middleware
- Cookies are properly secured with SameSite and Secure flags

## Environment Variables Security

### Environment Variable Usage Audit

#### Properly Configured (NEXT_PUBLIC_ prefix for client-side)

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Usage: Client-side Supabase configuration
   - Safe: Yes, this is meant to be public
   - Location: Used in lib/supabase/client.ts, lib/supabase/server.ts, middleware.ts

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Usage: Client-side Supabase authentication
   - Safe: Yes, this is the public anon key (protected by RLS)
   - Location: Used in lib/supabase/client.ts, lib/supabase/server.ts, middleware.ts

3. **NEXT_PUBLIC_SITE_URL**
   - Usage: Site URL for redirects and canonical links
   - Safe: Yes, this is public information
   - Location: Used in next.config.ts

4. **NEXT_PUBLIC_SITE_NAME**
   - Usage: Site name for branding
   - Safe: Yes, this is public information
   - Location: Used throughout the application

#### Server-Only (No NEXT_PUBLIC_ prefix - SECURE)

1. **SUPABASE_SERVICE_ROLE_KEY**
   - Usage: Server-side admin operations (scripts only)
   - Safe: YES - Only used in /scripts directory, never exposed to client
   - Location:
     - scripts/migrate-aircraft.ts
     - scripts/import-from-json.ts
     - scripts/update-images-from-json.ts
     - scripts/add-trailer.ts
     - scripts/update-sold-aircraft.ts
     - scripts/update-trailer-image.ts
   - Security: This key is NEVER imported or used in client-side code, API routes, or components

### Security Verification Results

**PASSED:** No sensitive environment variables are exposed to the client.

**PASSED:** SUPABASE_SERVICE_ROLE_KEY is only used in server-side scripts.

**PASSED:** All client-accessible variables use NEXT_PUBLIC_ prefix appropriately.

**PASSED:** No environment variables are hardcoded in client components.

## Image Security

### Remote Image Patterns

Images are restricted to specific domains via next.config.ts:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

This prevents loading images from untrusted sources.

## Database Security

### Row Level Security (RLS)

All database access uses Supabase's Row Level Security:

- Client-side operations use the NEXT_PUBLIC_SUPABASE_ANON_KEY
- RLS policies enforce authorization at the database level
- Admin operations are protected by role-based RLS policies
- Service role key is never exposed to client code

### SQL Injection Protection

- All database queries use Supabase client with parameterized queries
- No raw SQL is constructed from user input
- Type-safe queries using TypeScript interfaces

## Production Recommendations

### Before Launch

1. **Update CSP for Production**
   - Consider removing 'unsafe-inline' if possible
   - Implement nonce-based CSP for inline scripts
   - Review and tighten allowed domains

2. **Environment Variables**
   - Ensure .env.local is in .gitignore (verified)
   - Rotate SUPABASE_SERVICE_ROLE_KEY if exposed
   - Set up proper environment variables in hosting platform

3. **HTTPS Configuration**
   - Ensure production deployment uses HTTPS
   - Configure HSTS preload list submission
   - Set up proper SSL/TLS certificates

4. **Monitoring**
   - Set up error logging (consider Sentry or similar)
   - Monitor for CSP violations
   - Track failed authentication attempts

5. **Additional Security Measures**
   - Implement rate limiting for auth routes
   - Add CAPTCHA for contact form
   - Set up DDoS protection via hosting provider
   - Regular security audits and dependency updates

### Security Testing Checklist

- [ ] Test CSP headers with browser developer tools
- [ ] Verify HTTPS redirect works correctly
- [ ] Test authentication flows for unauthorized access
- [ ] Verify admin routes are properly protected
- [ ] Test session timeout and refresh
- [ ] Verify environment variables are not exposed
- [ ] Test file upload security (if applicable)
- [ ] Run security scanner (OWASP ZAP, Burp Suite)
- [ ] Check for exposed secrets in git history
- [ ] Verify cookie security flags

## Incident Response

If a security issue is discovered:

1. Immediately rotate all API keys and secrets
2. Review application logs for unauthorized access
3. Update RLS policies if needed
4. Deploy security patches immediately
5. Notify affected users if data breach occurred

## Security Contacts

For security issues, contact: [Your security contact email]

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/platform/going-into-prod)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
