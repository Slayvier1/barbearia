
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Create services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    icon TEXT NOT NULL DEFAULT '✂️',
    sort_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services" ON public.services
FOR SELECT USING (active = true);

CREATE POLICY "Admins can insert services" ON public.services
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services" ON public.services
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services" ON public.services
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all services" ON public.services
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '📦',
    active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products" ON public.products
FOR SELECT USING (active = true);

CREATE POLICY "Admins can insert products" ON public.products
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products" ON public.products
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all products" ON public.products
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial services
INSERT INTO public.services (name, duration, price, icon, sort_order) VALUES
('Corte', 45, 45.00, '✂️', 1),
('Barba', 30, 35.00, '🪒', 2),
('Combo', 60, 70.00, '💈', 3),
('Sobrancelha', 15, 20.00, '👁️', 4),
('Degradê', 50, 50.00, '🔥', 5),
('Pigmentação', 40, 60.00, '🎨', 6);

-- Seed initial products
INSERT INTO public.products (name, price, category, image, sort_order) VALUES
('Minoxidil 60ml', 89.90, 'Tratamento', '💊', 1),
('Pomada Modeladora', 45.90, 'Finalização', '🫙', 2),
('Máquina de Corte Pro', 299.90, 'Equipamento', '⚡', 3),
('Kit Giletes (10un)', 25.90, 'Acessório', '🔪', 4),
('Água Mineral', 5.00, 'Bebida', '💧', 5),
('Guaraná Lata', 7.00, 'Bebida', '🥤', 6),
('Pipoca Gourmet', 12.00, 'Snack', '🍿', 7),
('Bala de Menta', 3.00, 'Snack', '🍬', 8),
('Óleo para Barba', 55.90, 'Tratamento', '🧴', 9),
('Shampoo Anticaspa', 39.90, 'Tratamento', '🧴', 10);
