import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { AircraftFormData } from '@/schemas/aircraft'

type AircraftInsert = Database['public']['Tables']['aircraft']['Insert']
type AircraftUpdate = Database['public']['Tables']['aircraft']['Update']
type Aircraft = Database['public']['Tables']['aircraft']['Row']

export async function getAllAircraft(includeDeleted = false) {
  const supabase = createClient()

  let query = supabase
    .from('aircraft')
    .select('*')
    .order('created_at', { ascending: false })

  if (!includeDeleted) {
    query = query.is('deleted_at', null)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Aircraft[]
}

export async function getAircraftBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('aircraft')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data as Aircraft
}

export async function createAircraft(formData: AircraftFormData, userId: string) {
  const supabase = createClient()

  const aircraftData: AircraftInsert = {
    ...formData,
    features: formData.features ? JSON.stringify(formData.features) : null,
    created_by: userId,
  }

  const { data, error } = await supabase
    .from('aircraft')
    .insert(aircraftData)
    .select()
    .single()

  if (error) throw error
  return data as Aircraft
}

export async function updateAircraft(id: string, formData: Partial<AircraftFormData>) {
  const supabase = createClient()

  const aircraftData: AircraftUpdate = {
    ...formData,
    features: formData.features ? JSON.stringify(formData.features) : undefined,
  }

  const { data, error } = await supabase
    .from('aircraft')
    .update(aircraftData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Aircraft
}

export async function deleteAircraft(id: string, soft = true) {
  const supabase = createClient()

  if (soft) {
    // Soft delete
    const { data, error } = await supabase
      .from('aircraft')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Aircraft
  } else {
    // Hard delete
    const { error } = await supabase
      .from('aircraft')
      .delete()
      .eq('id', id)

    if (error) throw error
    return null
  }
}

export async function uploadAircraftImage(file: File, aircraftId: string) {
  const supabase = createClient()

  const fileExt = file.name.split('.').pop()
  const fileName = `${aircraftId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('aircraft-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('aircraft-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function deleteAircraftImage(url: string) {
  const supabase = createClient()

  // Extract path from URL
  const path = url.split('/aircraft-images/').pop()
  if (!path) throw new Error('Invalid image URL')

  const { error } = await supabase.storage
    .from('aircraft-images')
    .remove([path])

  if (error) throw error
}
