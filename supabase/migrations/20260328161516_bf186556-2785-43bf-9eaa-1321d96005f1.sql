
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_whatsapp text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  services jsonb NOT NULL DEFAULT '[]',
  products jsonb NOT NULL DEFAULT '[]',
  total_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(appointment_date, appointment_time)
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (create appointment)
CREATE POLICY "Anyone can create appointments" ON public.appointments
  FOR INSERT TO public WITH CHECK (true);

-- Anyone can read to check availability
CREATE POLICY "Anyone can read appointments" ON public.appointments
  FOR SELECT TO public USING (true);

-- Admins can manage all
CREATE POLICY "Admins can manage appointments" ON public.appointments
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
