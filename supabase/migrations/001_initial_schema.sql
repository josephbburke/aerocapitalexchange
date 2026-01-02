-- ================================================
-- USERS EXTENSION (extends Supabase auth.users)
-- ================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'super_admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- AIRCRAFT LISTINGS
-- ================================================
CREATE TABLE IF NOT EXISTS public.aircraft (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic Information
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending', 'draft')),

  -- Aircraft Details
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  year_manufactured INTEGER NOT NULL,
  registration_number TEXT,
  serial_number TEXT,

  -- Categorization
  category TEXT NOT NULL CHECK (category IN ('jet', 'turboprop', 'helicopter', 'piston')),
  aircraft_type TEXT,

  -- Specifications
  total_time_hours INTEGER,
  engines INTEGER,
  passengers_capacity INTEGER,
  max_range_nm INTEGER,
  max_speed_kts INTEGER,
  cruise_speed_kts INTEGER,
  max_altitude_ft INTEGER,

  -- Pricing
  price DECIMAL(15,2),
  price_currency TEXT DEFAULT 'USD',
  is_price_negotiable BOOLEAN DEFAULT true,

  -- Content
  description TEXT,
  features JSONB,
  specifications JSONB,

  -- Media
  primary_image_url TEXT,
  images JSONB,
  documents JSONB,

  -- SEO & Marketing
  meta_title TEXT,
  meta_description TEXT,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,

  -- Audit
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for aircraft table
CREATE INDEX IF NOT EXISTS idx_aircraft_status ON public.aircraft(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_aircraft_category ON public.aircraft(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_aircraft_featured ON public.aircraft(featured) WHERE featured = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_aircraft_slug ON public.aircraft(slug);
CREATE INDEX IF NOT EXISTS idx_aircraft_price ON public.aircraft(price) WHERE deleted_at IS NULL;

-- ================================================
-- INQUIRIES / CONTACT FORMS
-- ================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User Information
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,

  -- Inquiry Details
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('aircraft', 'financing', 'general', 'partnership')),
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Status & Assignment
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed', 'spam')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Metadata
  source TEXT,
  ip_address INET,
  user_agent TEXT,

  -- Admin Notes
  admin_notes TEXT,
  responded_at TIMESTAMPTZ,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for inquiries table
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_aircraft_id ON public.inquiries(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- ================================================
-- FAVORITES / SAVED AIRCRAFT
-- ================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  aircraft_id UUID NOT NULL REFERENCES public.aircraft(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, aircraft_id)
);

-- Indexes for favorites table
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_aircraft_id ON public.favorites(aircraft_id);

-- ================================================
-- ACTIVITY LOG / AUDIT TRAIL
-- ================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for activity_logs table
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aircraft_updated_at BEFORE UPDATE ON public.aircraft
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
