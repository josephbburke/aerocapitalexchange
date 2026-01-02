import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { InquiryFormData } from '@/schemas/inquiry'

type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']
type Inquiry = Database['public']['Tables']['inquiries']['Row']

export async function createInquiry(
  formData: InquiryFormData,
  aircraftId?: string,
  userId?: string
) {
  const supabase = createClient()

  const inquiryData: InquiryInsert = {
    ...formData,
    user_id: userId || null,
    aircraft_id: aircraftId || null,
    inquiry_type: aircraftId ? 'aircraft' : 'general',
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
