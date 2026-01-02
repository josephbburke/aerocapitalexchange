import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { InquiryFormData } from '@/schemas/inquiry'

type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']
type Inquiry = Database['public']['Tables']['inquiries']['Row']

/**
 * Create a new inquiry via the API route (recommended)
 * This uses the API route which includes rate limiting and email notifications
 */
export async function createInquiry(
  formData: InquiryFormData,
  aircraftId?: string,
  userId?: string
): Promise<Inquiry> {
  // Use the API route for rate limiting and email notifications
  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      aircraft_id: aircraftId,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle rate limiting
    if (response.status === 429) {
      throw new Error(data.message || 'Too many requests. Please try again later.')
    }
    // Handle validation errors
    if (response.status === 400) {
      throw new Error(data.message || 'Invalid inquiry data')
    }
    // Handle other errors
    throw new Error(data.message || 'Failed to submit inquiry')
  }

  // Fetch the complete inquiry data
  if (data.inquiry?.id) {
    return await getInquiryById(data.inquiry.id)
  }

  throw new Error('Failed to create inquiry')
}

/**
 * Create inquiry directly (bypasses API route)
 * Only use this for internal/server-side operations
 */
export async function createInquiryDirect(
  formData: InquiryFormData,
  aircraftId?: string,
  userId?: string
): Promise<Inquiry> {
  const supabase = createClient()

  const inquiryData: InquiryInsert = {
    ...formData,
    user_id: userId || null,
    aircraft_id: aircraftId || null,
    inquiry_type: formData.inquiry_type || (aircraftId ? 'aircraft' : 'general'),
    status: 'new',
    priority: 'medium',
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiryData)
    .select()
    .single()

  if (error) throw error
  return data as Inquiry
}

export async function getUserInquiries(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Inquiry[]
}

export async function getInquiryById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Inquiry
}

export async function getAllInquiries() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inquiries')
    .select('*, aircraft:aircraft_id(title, slug)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateInquiryStatus(
  id: string,
  status: 'new' | 'in_progress' | 'responded' | 'closed' | 'spam'
) {
  const supabase = createClient()

  const updateData: any = { status }
  if (status === 'responded') {
    updateData.responded_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('inquiries')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Inquiry
}

export async function updateInquiryNotes(id: string, notes: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inquiries')
    .update({ admin_notes: notes })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Inquiry
}

export async function updateInquiry(
  id: string,
  updates: Partial<Database['public']['Tables']['inquiries']['Update']>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Inquiry
}

export async function updateInquiryPriority(
  id: string,
  priority: 'low' | 'medium' | 'high' | 'urgent'
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inquiries')
    .update({ priority })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Inquiry
}

export async function deleteInquiry(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id)

  if (error) throw error
}
