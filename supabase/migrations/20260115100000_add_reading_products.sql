-- Add reading_products table for managing reading services
CREATE TABLE IF NOT EXISTS public.reading_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'standard',
  delivery_time TEXT DEFAULT '24-48 hours',
  is_live_reading BOOLEAN DEFAULT false,
  calendly_link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reading_products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "reading_products_public_read" ON public.reading_products
  FOR SELECT USING (true);

-- Allow authenticated users to manage (admin)
CREATE POLICY "reading_products_admin_all" ON public.reading_products
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default reading products
INSERT INTO public.reading_products (title, description, price, image_url, category, delivery_time, is_live_reading, sort_order) VALUES
('Love & Relationships', 'Discover what the cards reveal about your love life, whether you''re single, dating, or in a relationship. Sue will guide you through matters of the heart with compassion and clarity.', 35.00, '/assets/images/love_relationships_tarot_reading.png', 'standard', '24-48 hours', false, 1),
('General Tarot', 'A comprehensive reading covering all areas of your life. Perfect when you''re not sure what to ask or want a complete overview of your current situation and near future.', 35.00, '/assets/images/general_tarot_reading_spread.png', 'standard', '24-48 hours', false, 2),
('Money & Career', 'Focus on your professional path, business decisions, and financial matters. Get clarity on job changes, business opportunities, and abundance.', 35.00, '/assets/images/money_career_tarot_reading.png', 'standard', '24-48 hours', false, 3),
('Express Reading', 'Need quick guidance? Get a focused 3-card reading for one specific question. Perfect for time-sensitive decisions when you need spiritual insight fast.', 55.00, '/assets/images/express_tarot_reading.png', 'express', '12-24 hours', false, 4),
('Full In-Depth Reading', 'Our most comprehensive reading. Sue will use multiple spreads to give you detailed insight into your situation, including timing, obstacles, and outcomes.', 45.00, '/assets/images/full_in_depth_tarot_reading.png', 'premium', '48-72 hours', false, 5),
('Live 30 Min Phone Reading', 'Connect with Sue directly for a live phone or video reading. Ask unlimited questions and receive immediate guidance. Includes recording of your session.', 100.00, '/assets/images/live_phone_tarot_reading.png', 'live', 'Scheduled', true, 6);

-- Add guest booking fields to bookings table if they don't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_message TEXT,
ADD COLUMN IF NOT EXISTS reading_title TEXT,
ADD COLUMN IF NOT EXISTS reading_price DECIMAL(10,2);

-- Allow anonymous users to create bookings (for guest checkout)
CREATE POLICY IF NOT EXISTS "anon_create_bookings" ON public.bookings
  FOR INSERT TO anon WITH CHECK (true);
