/**
 * Security Headers Test Script
 *
 * This script helps verify that security headers are properly configured.
 * Run this after deploying to production to verify headers are applied.
 *
 * Usage: npx tsx scripts/test-security-headers.ts [URL]
 * Example: npx tsx scripts/test-security-headers.ts https://your-domain.com
 */

const url = process.argv[2] || 'http://localhost:3000'

console.log(`\n🔒 Testing Security Headers for: ${url}\n`)

const expectedHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'x-xss-protection': '1; mode=block',
  'referrer-policy': 'origin-when-cross-origin',
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'content-security-policy': true, // Just check it exists
  'permissions-policy': true, // Just check it exists
  'cross-origin-embedder-policy': 'credentialless',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
}

async function testHeaders() {
  try {
    const response = await fetch(url)
    const headers = response.headers

    console.log('📋 Response Headers:\n')

    let allPassed = true
    const results: { header: string; status: string; value: string }[] = []

    for (const [headerName, expectedValue] of Object.entries(expectedHeaders)) {
      const actualValue = headers.get(headerName)

      if (!actualValue) {
        results.push({
          header: headerName,
          status: '❌ MISSING',
          value: 'Not found',
        })
        allPassed = false
      } else if (expectedValue === true) {
        // Just check existence
        results.push({
          header: headerName,
          status: '✅ PRESENT',
          value: actualValue.substring(0, 50) + (actualValue.length > 50 ? '...' : ''),
        })
      } else if (actualValue === expectedValue) {
        results.push({
          header: headerName,
          status: '✅ CORRECT',
          value: actualValue,
        })
      } else {
        results.push({
          header: headerName,
          status: '⚠️  MISMATCH',
          value: `Expected: ${expectedValue}\nActual: ${actualValue}`,
        })
        allPassed = false
      }
    }

    // Print results in a formatted table
    results.forEach(({ header, status, value }) => {
      console.log(`${status} ${header}`)
      if (value.includes('\n')) {
        console.log(`    ${value.replace(/\n/g, '\n    ')}`)
      } else {
        console.log(`    ${value}`)
      }
      console.log()
    })

    // Summary
    console.log('━'.repeat(60))
    if (allPassed) {
      console.log('✅ All security headers are correctly configured!')
    } else {
      console.log('❌ Some security headers are missing or misconfigured.')
      console.log('   Please review the configuration in next.config.ts and middleware.ts')
    }
    console.log('━'.repeat(60))

    // Additional recommendations
    console.log('\n📚 Additional Security Checks:\n')
    console.log('1. Verify HTTPS is enforced in production')
    console.log('2. Test CSP policy with browser DevTools')
    console.log('3. Check for mixed content warnings')
    console.log('4. Verify cookies have Secure and HttpOnly flags')
    console.log('5. Run security scanner (e.g., Mozilla Observatory, SecurityHeaders.com)')
    console.log('6. Check Supabase RLS policies are active')
    console.log('7. Verify environment variables are not exposed in client bundle')

    process.exit(allPassed ? 0 : 1)
  } catch (error) {
    console.error('❌ Error testing headers:', error)
    console.log('\n💡 Make sure the development server is running:')
    console.log('   npm run dev')
    process.exit(1)
  }
}

testHeaders()
