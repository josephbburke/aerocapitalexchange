-- Create inquiries table for contact form submissions
-- This migration ensures the inquiries table exists with all required fields

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User information
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(100),

    -- Inquiry details
    inquiry_type VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (inquiry_type IN ('aircraft', 'financing', 'general', 'partnership')),
    aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE SET NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    -- Status and priority
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed', 'spam')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

    -- Assignment
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Tracking information
    source VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Admin notes
    admin_notes TEXT,

    -- Timestamps
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_aircraft_id ON public.inquiries(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_priority ON public.inquiries(priority);
CREATE INDEX IF NOT EXISTS idx_inquiries_inquiry_type ON public.inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON public.inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_to ON public.inquiries(assigned_to);

-- Create a trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER trigger_inquiries_updated_at
    BEFORE UPDATE ON public.inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_inquiries_updated_at();

-- Enable Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Users can view their own inquiries
DROP POLICY IF EXISTS "Users can view own inquiries" ON public.inquiries;
CREATE POLICY "Users can view own inquiries"
    ON public.inquiries
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR auth.uid() IN (
            SELECT id FROM public.profiles
            WHERE role IN ('admin', 'super_admin')
        )
    );

-- Policy: Admins can view all inquiries
DROP POLICY IF EXISTS "Admins can view all inquiries" ON public.inquiries;
CREATE POLICY "Admins can view all inquiries"
    ON public.inquiries
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles
            WHERE role IN ('admin', 'super_admin')
        )
    );

-- Policy: Anyone can create inquiries (authenticated or not)
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
CREATE POLICY "Anyone can create inquiries"
    ON public.inquiries
    FOR INSERT
    WITH CHECK (true);

-- Policy: Admins can update inquiries
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
CREATE POLICY "Admins can update inquiries"
    ON public.inquiries
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles
            WHERE role IN ('admin', 'super_admin')
        )
    );

-- Policy: Only super admins can delete inquiries
DROP POLICY IF EXISTS "Super admins can delete inquiries" ON public.inquiries;
CREATE POLICY "Super admins can delete inquiries"
    ON public.inquiries
    FOR DELETE
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles
            WHERE role = 'super_admin'
        )
    );

-- Create a view for inquiry statistics (admin use)
CREATE OR REPLACE VIEW public.inquiry_statistics AS
SELECT
    inquiry_type,
    status,
    COUNT(*) as count,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7d,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30d
FROM public.inquiries
GROUP BY inquiry_type, status;

-- Grant access to the statistics view for admins
GRANT SELECT ON public.inquiry_statistics TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.inquiries IS 'Stores all customer inquiries submitted through contact forms';
COMMENT ON COLUMN public.inquiries.inquiry_type IS 'Type of inquiry: aircraft, financing, general, or partnership';
COMMENT ON COLUMN public.inquiries.status IS 'Current status: new, in_progress, responded, closed, or spam';
COMMENT ON COLUMN public.inquiries.priority IS 'Priority level: low, medium, high, or urgent';
COMMENT ON COLUMN public.inquiries.source IS 'Source of the inquiry (e.g., website, mobile app)';
COMMENT ON COLUMN public.inquiries.ip_address IS 'IP address of the submitter for spam prevention';
