
-- Create storage bucket for portfolio photos
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Allow anyone to view portfolio files
CREATE POLICY "Anyone can view portfolio" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'portfolio');

-- Only admins can upload
CREATE POLICY "Admins can upload portfolio" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin')
  );

-- Only admins can delete
CREATE POLICY "Admins can delete portfolio" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin')
  );

-- Portfolio metadata table
CREATE TABLE public.portfolio_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL,
  caption text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos" ON public.portfolio_photos
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage photos" ON public.portfolio_photos
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
