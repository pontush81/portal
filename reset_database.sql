-- Radera befintliga tabeller och scheman
DROP SCHEMA public CASCADE;

-- Återskapa public schema
CREATE SCHEMA public;

-- Återställ standardrättigheter
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Skapa användartabeller

-- Handbok-tabell - lagrar information om skapade handböcker
CREATE TABLE handbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  association_name TEXT NOT NULL,
  association_type TEXT NOT NULL,
  address TEXT,
  zip_code TEXT,
  city TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_person TEXT,
  logo_url TEXT,
  selected_sections TEXT[],
  custom_information TEXT,
  customer_email TEXT NOT NULL,
  pdf_url TEXT,
  site_url TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT
);

-- Storage-buckets för PDF och bilder
CREATE TABLE storage_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name TEXT NOT NULL,
  object_path TEXT NOT NULL,
  content_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  size INTEGER,
  UNIQUE(bucket_name, object_path)
);

-- Inställningar för RLS (Row Level Security)
ALTER TABLE handbooks ENABLE ROW LEVEL SECURITY;

-- Policy som tillåter anonym läsning för vissa fält
CREATE POLICY "Allow anonymous read access" ON handbooks
  FOR SELECT USING (
    payment_status = 'completed'
  );

-- Policy som tillåter anonym insättning
CREATE POLICY "Allow anonymous insert" ON handbooks
  FOR INSERT WITH CHECK (true);

-- Skapa bucket för lagring
-- OBS! Detta kan behöva göras via Storage UI i Supabase
-- INSERT INTO storage.buckets (id, name, public) VALUES ('handbooks', 'handbooks', true); 