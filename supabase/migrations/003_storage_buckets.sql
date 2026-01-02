-- ================================================
-- STORAGE BUCKETS
-- ================================================
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('aircraft-images', 'aircraft-images', true),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- STORAGE POLICIES FOR AIRCRAFT-IMAGES
-- ================================================
CREATE POLICY "Anyone can view aircraft images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'aircraft-images');

CREATE POLICY "Admins can upload aircraft images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'aircraft-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update aircraft images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'aircraft-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete aircraft images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'aircraft-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ================================================
-- STORAGE POLICIES FOR DOCUMENTS
-- ================================================
CREATE POLICY "Authenticated users can view documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
