// Email notification utilities
// Currently using console.log for development
// In production, integrate with services like:
// - Resend (https://resend.com)
// - SendGrid
// - AWS SES
// - Mailgun

import { Database } from '@/types/database'

type Inquiry = Database['public']['Tables']['inquiries']['Row']

export interface EmailNotificationData {
  to: string
  subject: string
  body: string
  replyTo?: string
}

/**
 * Send email notification
 * Currently logs to console - implement actual email service in production
 */
export async function sendEmail(data: EmailNotificationData): Promise<void> {
  console.log('='.repeat(80))
  console.log('EMAIL NOTIFICATION')
  console.log('='.repeat(80))
  console.log(`To: ${data.to}`)
  console.log(`Subject: ${data.subject}`)
  if (data.replyTo) {
    console.log(`Reply-To: ${data.replyTo}`)
  }
  console.log('-'.repeat(80))
  console.log(data.body)
  console.log('='.repeat(80))

  // TODO: Implement actual email sending in production
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@aerocapitalexchange.com',
  //   to: data.to,
  //   subject: data.subject,
  //   html: data.body,
  //   replyTo: data.replyTo,
  // })
}

/**
 * Send inquiry notification to admin
 */
export async function sendInquiryNotification(inquiry: Partial<Inquiry>): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || 'info@aerocapitalexchange.com'

  const inquiryTypeLabel = {
    aircraft: 'Aircraft Inquiry',
    financing: 'Financing Inquiry',
    general: 'General Inquiry',
    partnership: 'Partnership Inquiry',
  }[inquiry.inquiry_type || 'general']

  const subject = `New ${inquiryTypeLabel}: ${inquiry.subject}`

  const body = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #1e40af; }
    .value { margin-top: 5px; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New Inquiry Received</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${inquiryTypeLabel}</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From:</div>
        <div class="value">${inquiry.full_name}</div>
      </div>

      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></div>
      </div>

      ${inquiry.phone ? `
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></div>
      </div>
      ` : ''}

      ${inquiry.company_name ? `
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${inquiry.company_name}</div>
      </div>
      ` : ''}

      <div class="field">
        <div class="label">Subject:</div>
        <div class="value">${inquiry.subject}</div>
      </div>

      <div class="field">
        <div class="label">Message:</div>
        <div class="value" style="white-space: pre-wrap;">${inquiry.message}</div>
      </div>

      <div class="field">
        <div class="label">Inquiry Type:</div>
        <div class="value">${inquiryTypeLabel}</div>
      </div>

      ${inquiry.aircraft_id ? `
      <div class="field">
        <div class="label">Aircraft ID:</div>
        <div class="value">${inquiry.aircraft_id}</div>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>This inquiry was submitted through the Aero Capital Exchange website.</p>
      <p>Please respond within 24 hours to maintain excellent customer service.</p>
    </div>
  </div>
</body>
</html>
  `.trim()

  await sendEmail({
    to: adminEmail,
    subject,
    body,
    replyTo: inquiry.email,
  })
}

/**
 * Send confirmation email to the user who submitted the inquiry
 */
export async function sendInquiryConfirmation(inquiry: Partial<Inquiry>): Promise<void> {
  if (!inquiry.email) return

  const subject = 'Thank you for contacting Aero Capital Exchange'

  const body = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .highlight { background: #f3f4f6; padding: 15px; border-left: 4px solid #1e40af; margin: 20px 0; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #1e40af; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Thank You!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your inquiry</p>
    </div>
    <div class="content">
      <p>Dear ${inquiry.full_name},</p>

      <p>Thank you for contacting Aero Capital Exchange. We have received your inquiry and our team will review it shortly.</p>

      <div class="highlight">
        <p style="margin: 0;"><strong>Your inquiry details:</strong></p>
        <p style="margin: 10px 0 0 0;"><strong>Subject:</strong> ${inquiry.subject}</p>
      </div>

      <p>A member of our team will respond to your inquiry within 24 hours during business hours (Monday-Friday, 9 AM - 6 PM EST).</p>

      <p>In the meantime, feel free to:</p>
      <ul>
        <li>Browse our available aircraft inventory</li>
        <li>Learn more about our financing options</li>
        <li>Review our frequently asked questions</li>
      </ul>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">Visit Our Website</a>
      </div>

      <p>If you have any urgent questions, please don't hesitate to call us at +1 (555) 012-3456.</p>

      <p>Best regards,<br>
      <strong>The Aero Capital Exchange Team</strong></p>
    </div>
    <div class="footer">
      <p><strong>Aero Capital Exchange</strong></p>
      <p>Florida, United States</p>
      <p>Email: info@aerocapitalexchange.com | Phone: +1 (555) 012-3456</p>
      <p style="margin-top: 15px; font-size: 12px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()

  await sendEmail({
    to: inquiry.email,
    subject,
    body,
  })
}

/**
 * Format plain text version of inquiry notification
 */
export function formatInquiryTextNotification(inquiry: Partial<Inquiry>): string {
  const inquiryTypeLabel = {
    aircraft: 'Aircraft Inquiry',
    financing: 'Financing Inquiry',
    general: 'General Inquiry',
    partnership: 'Partnership Inquiry',
  }[inquiry.inquiry_type || 'general']

  return `
NEW INQUIRY RECEIVED
${'='.repeat(60)}

Type: ${inquiryTypeLabel}
From: ${inquiry.full_name}
Email: ${inquiry.email}
${inquiry.phone ? `Phone: ${inquiry.phone}` : ''}
${inquiry.company_name ? `Company: ${inquiry.company_name}` : ''}

Subject: ${inquiry.subject}

Message:
${inquiry.message}

${'='.repeat(60)}
Submitted: ${new Date().toLocaleString()}
  `.trim()
}
