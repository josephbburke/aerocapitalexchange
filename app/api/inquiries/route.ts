import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inquiryApiSchema } from '@/schemas/inquiry'
import { rateLimit, getClientIp, RateLimitPresets } from '@/lib/utils/rate-limit'
import { sendInquiryNotification, sendInquiryConfirmation } from '@/lib/utils/email'
import { Database } from '@/types/database'

type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']

/**
 * POST /api/inquiries
 * Create a new inquiry with rate limiting and email notifications
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request)

    // Apply rate limiting: 5 requests per 15 minutes
    const rateLimitResult = rateLimit({
      ...RateLimitPresets.contactForm,
      identifier: clientIp,
      endpoint: 'inquiries',
    })

    // Add rate limit headers to response
    const headers = {
      'X-RateLimit-Limit': rateLimitResult.limit.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
    }

    // Check if rate limit exceeded
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again after ${rateLimitResult.reset.toLocaleTimeString()}.`,
          retryAfter: rateLimitResult.reset.toISOString(),
        },
        {
          status: 429,
          headers,
        }
      )
    }

    // Parse request body
    const body = await request.json()

    // Get user agent and IP for tracking
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = clientIp !== 'unknown' ? clientIp : undefined

    // Validate request data
    const validationResult = inquiryApiSchema.safeParse({
      ...body,
      user_agent: userAgent,
      ip_address: ipAddress,
      source: 'website',
    })

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: 'Invalid inquiry data',
          details: validationResult.error.issues,
        },
        {
          status: 400,
          headers,
        }
      )
    }

    const data = validationResult.data

    // Create Supabase client
    const supabase = await createClient()

    // Get current user if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Prepare inquiry data for database
    const inquiryData: InquiryInsert = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      company_name: data.company_name || null,
      subject: data.subject,
      message: data.message,
      inquiry_type: data.inquiry_type || 'general',
      aircraft_id: data.aircraft_id || null,
      user_id: user?.id || null,
      status: 'new',
      priority: 'medium',
      source: data.source || 'website',
      ip_address: data.ip_address || null,
      user_agent: data.user_agent || null,
    }

    // Insert inquiry into database
    const { data: inquiry, error: dbError } = await supabase
      .from('inquiries')
      .insert(inquiryData)
      .select()
      .single()

    if (dbError) {
      console.error('Database error creating inquiry:', dbError)
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Failed to save inquiry. Please try again later.',
        },
        {
          status: 500,
          headers,
        }
      )
    }

    // Send email notifications (async, don't wait for completion)
    Promise.all([
      sendInquiryNotification(inquiry).catch((error) => {
        console.error('Failed to send admin notification:', error)
      }),
      sendInquiryConfirmation(inquiry).catch((error) => {
        console.error('Failed to send user confirmation:', error)
      }),
    ])

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        inquiry: {
          id: inquiry.id,
          created_at: inquiry.created_at,
        },
      },
      {
        status: 201,
        headers,
      }
    )
  } catch (error) {
    console.error('Unexpected error in inquiry API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      {
        status: 500,
      }
    )
  }
}

/**
 * GET /api/inquiries
 * Get inquiries (admin only or user's own inquiries)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'You must be logged in to view inquiries',
        },
        { status: 401 }
      )
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    // Build query based on role
    let query = supabase.from('inquiries').select('*, aircraft:aircraft_id(title, slug)')

    if (!isAdmin) {
      // Regular users can only see their own inquiries
      query = query.eq('user_id', user.id)
    }

    const { data: inquiries, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Database error fetching inquiries:', error)
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Failed to fetch inquiries',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      inquiries,
    })
  } catch (error) {
    console.error('Unexpected error in inquiry GET API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
