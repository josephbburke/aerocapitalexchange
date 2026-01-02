export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          company_name: string | null
          role: 'client' | 'admin' | 'super_admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          company_name?: string | null
          role?: 'client' | 'admin' | 'super_admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          company_name?: string | null
          role?: 'client' | 'admin' | 'super_admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      aircraft: {
        Row: {
          id: string
          title: string
          slug: string
          status: 'available' | 'sold' | 'pending' | 'draft'
          manufacturer: string
          model: string
          year_manufactured: number
          registration_number: string | null
          serial_number: string | null
          category: 'jet' | 'turboprop' | 'helicopter' | 'piston'
          aircraft_type: string | null
          total_time_hours: number | null
          engines: number | null
          passengers_capacity: number | null
          max_range_nm: number | null
          max_speed_kts: number | null
          cruise_speed_kts: number | null
          max_altitude_ft: number | null
          price: number | null
          price_currency: string
          is_price_negotiable: boolean
          description: string | null
          features: Json | null
          specifications: Json | null
          primary_image_url: string | null
          images: Json | null
          documents: Json | null
          meta_title: string | null
          meta_description: string | null
          featured: boolean
          view_count: number
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          status?: 'available' | 'sold' | 'pending' | 'draft'
          manufacturer: string
          model: string
          year_manufactured: number
          registration_number?: string | null
          serial_number?: string | null
          category: 'jet' | 'turboprop' | 'helicopter' | 'piston'
          aircraft_type?: string | null
          total_time_hours?: number | null
          engines?: number | null
          passengers_capacity?: number | null
          max_range_nm?: number | null
          max_speed_kts?: number | null
          cruise_speed_kts?: number | null
          max_altitude_ft?: number | null
          price?: number | null
          price_currency?: string
          is_price_negotiable?: boolean
          description?: string | null
          features?: Json | null
          specifications?: Json | null
          primary_image_url?: string | null
          images?: Json | null
          documents?: Json | null
          meta_title?: string | null
          meta_description?: string | null
          featured?: boolean
          view_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          status?: 'available' | 'sold' | 'pending' | 'draft'
          manufacturer?: string
          model?: string
          year_manufactured?: number
          registration_number?: string | null
          serial_number?: string | null
          category?: 'jet' | 'turboprop' | 'helicopter' | 'piston'
          aircraft_type?: string | null
          total_time_hours?: number | null
          engines?: number | null
          passengers_capacity?: number | null
          max_range_nm?: number | null
          max_speed_kts?: number | null
          cruise_speed_kts?: number | null
          max_altitude_ft?: number | null
          price?: number | null
          price_currency?: string
          is_price_negotiable?: boolean
          description?: string | null
          features?: Json | null
          specifications?: Json | null
          primary_image_url?: string | null
          images?: Json | null
          documents?: Json | null
          meta_title?: string | null
          meta_description?: string | null
          featured?: boolean
          view_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      inquiries: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string | null
          company_name: string | null
          inquiry_type: 'aircraft' | 'financing' | 'general' | 'partnership'
          aircraft_id: string | null
          subject: string
          message: string
          status: 'new' | 'in_progress' | 'responded' | 'closed' | 'spam'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string | null
          source: string | null
          ip_address: string | null
          user_agent: string | null
          admin_notes: string | null
          responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          company_name?: string | null
          inquiry_type: 'aircraft' | 'financing' | 'general' | 'partnership'
          aircraft_id?: string | null
          subject: string
          message: string
          status?: 'new' | 'in_progress' | 'responded' | 'closed' | 'spam'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          source?: string | null
          ip_address?: string | null
          user_agent?: string | null
          admin_notes?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          company_name?: string | null
          inquiry_type?: 'aircraft' | 'financing' | 'general' | 'partnership'
          aircraft_id?: string | null
          subject?: string
          message?: string
          status?: 'new' | 'in_progress' | 'responded' | 'closed' | 'spam'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          source?: string | null
          ip_address?: string | null
          user_agent?: string | null
          admin_notes?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          aircraft_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          aircraft_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          aircraft_id?: string
          notes?: string | null
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Aircraft = Database['public']['Tables']['aircraft']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']
