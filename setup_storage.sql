-- Skapa storage bucket för handböcker
-- Kör dessa kommandon i Supabase SQL Editor efter att storage-tillägget är aktiverat

-- Skapa bucket för handböcker
INSERT INTO storage.buckets (id, name, public)
VALUES ('handbooks', 'handbooks', true)
ON CONFLICT (id) DO NOTHING;

-- Aktivera Storage API
CREATE SCHEMA IF NOT EXISTS storage;

-- Skapa RLS-policy för lagring (tillåt anonym läsning)
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'handbooks' AND
    auth.role() = 'anon'
  );

-- Policy för anonym uppladdning (viktigt: i produktion bör detta begränsas)
CREATE POLICY "Allow anonymous uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'handbooks' 
  );

-- Skapa policy för att ta bort objekt
CREATE POLICY "Allow anonymous deletion" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'handbooks'
  ); 