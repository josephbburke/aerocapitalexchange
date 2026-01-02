# Password Reset Flow - Verification Checklist

## Pre-Testing Setup

### 1. Environment Configuration
- [ ] Verify `.env.local` file exists with required variables:
  ```env
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
  ```

### 2. Supabase Configuration
- [ ] Go to Supabase Dashboard > Authentication > Email Templates
- [ ] Verify "Reset Password" template is enabled
- [ ] Confirm template includes `{{ .ConfirmationURL }}`
- [ ] Test email delivery is working

### 3. Development Server
- [ ] Run `npm install` to ensure dependencies are installed
- [ ] Run `npm run dev` to start development server
- [ ] Confirm server starts on http://localhost:3000

## Functional Testing

### Test 1: Navigate to Reset Password Page
- [ ] Go to http://localhost:3000/auth/login
- [ ] Click "Forgot password?" link
- [ ] Verify redirect to `/auth/reset-password`
- [ ] Confirm page displays with correct title and branding

### Test 2: Form Validation - Email Field
- [ ] Try submitting empty form
  - [ ] Should show "Invalid email address" error
- [ ] Enter invalid email (e.g., "test")
  - [ ] Should show "Invalid email address" error
- [ ] Enter invalid email (e.g., "test@")
  - [ ] Should show "Invalid email address" error
- [ ] Enter valid email format
  - [ ] Error should disappear

### Test 3: Password Reset Request - Success Flow
- [ ] Enter a valid email address registered in your system
- [ ] Click "Send Reset Link"
- [ ] Verify:
  - [ ] Button shows "Sending reset link..." during request
  - [ ] Success page appears with green checkmark
  - [ ] Instructions to check email are displayed
  - [ ] "Back to Sign In" button is visible

### Test 4: Email Receipt
- [ ] Check inbox for email from Supabase
- [ ] Verify email contains:
  - [ ] Subject line about password reset
  - [ ] Reset link with token
  - [ ] Link is clickable
- [ ] Check spam/junk folder if not in inbox

### Test 5: Reset Link - Valid Token
- [ ] Click reset link from email
- [ ] Verify:
  - [ ] Redirects to `/auth/reset-password/confirm`
  - [ ] Page shows "Set New Password" title
  - [ ] Lock icon is displayed
  - [ ] Form has two password fields
  - [ ] Password requirements box is visible

### Test 6: Password Field Validation
- [ ] Test password too short:
  - [ ] Enter "Test123" (7 characters)
  - [ ] Submit form
  - [ ] Should show "Password must be at least 8 characters"

- [ ] Test password without uppercase:
  - [ ] Enter "test1234"
  - [ ] Submit form
  - [ ] Should show "must contain at least one uppercase letter"

- [ ] Test password without lowercase:
  - [ ] Enter "TEST1234"
  - [ ] Submit form
  - [ ] Should show "must contain at least one lowercase letter"

- [ ] Test password without number:
  - [ ] Enter "TestTest"
  - [ ] Submit form
  - [ ] Should show "must contain at least one number"

### Test 7: Password Confirmation Mismatch
- [ ] Enter valid password: "TestPass123"
- [ ] Enter different confirmation: "TestPass456"
- [ ] Submit form
- [ ] Verify error: "Passwords don't match"

### Test 8: Password Strength Indicator
- [ ] Enter "test" - verify shows "Weak" with red bar
- [ ] Enter "Test123" - verify shows "Fair" with yellow bar
- [ ] Enter "TestPass123" - verify shows "Good" or "Strong" with blue/green bar
- [ ] Verify bar width increases with strength

### Test 9: Real-time Requirements Checklist
Start with empty password field and type each character:
- [ ] Type "t" - no checkmarks
- [ ] Type "T" - "One uppercase letter" gets checkmark
- [ ] Continue to "Test" - uppercase and lowercase checked
- [ ] Type "1" - "One number" gets checkmark
- [ ] Complete to "TestPass1" - "At least 8 characters" gets checkmark
- [ ] All requirements should have green checkmarks

### Test 10: Successful Password Reset
- [ ] Enter valid password: "NewPass123"
- [ ] Confirm password: "NewPass123"
- [ ] Click "Update Password"
- [ ] Verify:
  - [ ] Button shows "Updating password..." during request
  - [ ] Success page appears with green checkmark
  - [ ] "Password Updated!" message displayed
  - [ ] Auto-redirect to login page after ~2 seconds

### Test 11: Login with New Password
- [ ] After redirect to login page
- [ ] Enter email used for reset
- [ ] Enter NEW password
- [ ] Click "Sign In"
- [ ] Verify successful login to dashboard

### Test 12: Invalid/Expired Token
- [ ] Click reset link from email again (already used)
  OR
- [ ] Manually navigate to `/auth/reset-password/confirm` without token
- [ ] Verify:
  - [ ] Page shows "Invalid or Expired Link" error
  - [ ] Red alert icon is displayed
  - [ ] Error message explains the issue
  - [ ] "Request New Reset Link" button is visible
  - [ ] "Back to Sign In" button is visible

### Test 13: Navigation and Links
- [ ] From reset request page:
  - [ ] Click "Back to Sign In" → should go to login
- [ ] From success page:
  - [ ] Click "Back to Sign In" → should go to login
- [ ] From confirmation page:
  - [ ] Click "Cancel" → should go to login
- [ ] From invalid token page:
  - [ ] Click "Request New Reset Link" → should go to reset request
  - [ ] Click "Back to Sign In" → should go to login

### Test 14: Loading States
- [ ] On reset request page:
  - [ ] Submit form and verify button is disabled during request
  - [ ] Verify button text changes to "Sending reset link..."
- [ ] On confirmation page:
  - [ ] Submit form and verify button is disabled during request
  - [ ] Verify button text changes to "Updating password..."

### Test 15: Error Handling
- [ ] Disconnect internet before submitting reset request
  - [ ] Verify network error is displayed
- [ ] Enter email not in system
  - [ ] Should still show success (security: no email enumeration)
- [ ] Test with Supabase API down (if possible)
  - [ ] Verify graceful error handling

## Mobile Responsiveness Testing

### Test 16: Mobile Layout (320px - 480px)
- [ ] Open browser dev tools
- [ ] Set viewport to iPhone SE (375px)
- [ ] Test reset request page:
  - [ ] Form is readable
  - [ ] Buttons are touch-friendly (min 44px height)
  - [ ] No horizontal scrolling
  - [ ] Text is legible without zooming
- [ ] Test confirmation page:
  - [ ] All elements visible
  - [ ] Password requirements box readable
  - [ ] Strength indicator visible
  - [ ] No layout breaks

### Test 17: Tablet Layout (768px - 1024px)
- [ ] Set viewport to iPad (768px)
- [ ] Verify all pages display correctly
- [ ] Confirm no layout issues

### Test 18: Desktop Layout (1280px+)
- [ ] Set viewport to desktop size
- [ ] Verify forms are centered
- [ ] Confirm max-width constraint works
- [ ] Check spacing and padding

## Accessibility Testing

### Test 19: Keyboard Navigation
- [ ] Use only keyboard (Tab, Enter, Shift+Tab)
- [ ] Navigate through reset request form
- [ ] Navigate through confirmation form
- [ ] Verify all interactive elements are reachable
- [ ] Verify focus indicators are visible

### Test 20: Screen Reader (Optional)
- [ ] Enable screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Navigate through forms
- [ ] Verify labels are announced
- [ ] Verify error messages are announced

## Cross-Browser Testing

### Test 21: Chrome/Edge
- [ ] Test complete flow in Chrome
- [ ] Test complete flow in Edge

### Test 22: Firefox
- [ ] Test complete flow in Firefox

### Test 23: Safari (if available)
- [ ] Test complete flow in Safari

## Security Testing

### Test 24: Token Security
- [ ] Click reset link
- [ ] Copy URL from address bar
- [ ] Complete password reset
- [ ] Try using copied URL again
- [ ] Verify shows invalid token error

### Test 25: Password Requirements Enforcement
- [ ] Try various weak passwords
- [ ] Verify all are rejected
- [ ] Confirm only strong passwords are accepted

### Test 26: Session Handling
- [ ] After password reset, verify:
  - [ ] Old sessions are invalidated
  - [ ] Must login with new password
  - [ ] Cannot use old password

## Performance Testing

### Test 27: Page Load Time
- [ ] Use Chrome DevTools Network tab
- [ ] Measure page load time
- [ ] Should be < 2 seconds on fast connection

### Test 28: Form Submission Speed
- [ ] Measure time from click to response
- [ ] Should be < 3 seconds under normal conditions

## Known Issues to Document

- [ ] Note any issues found
- [ ] Create GitHub issues if applicable
- [ ] Document workarounds

## Sign-off

Testing completed by: _______________
Date: _______________
Environment: _______________
Browser versions tested: _______________

All critical tests passing: [ ] Yes [ ] No
Ready for production: [ ] Yes [ ] No

Notes:
_______________________________________________
_______________________________________________
_______________________________________________
