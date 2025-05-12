-- Skapa index för att optimera databasen

-- Index för sökningar på handbooks-tabellen
CREATE INDEX idx_handbooks_association_name ON handbooks (association_name);
CREATE INDEX idx_handbooks_customer_email ON handbooks (customer_email);
CREATE INDEX idx_handbooks_payment_status ON handbooks (payment_status);
CREATE INDEX idx_handbooks_created_at ON handbooks (created_at);

-- Triggar för uppdatering av updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_handbooks_updated_at
BEFORE UPDATE ON handbooks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Lägg till extra kolumner i handbooks för hantering av uppdateringar
ALTER TABLE handbooks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE handbooks ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Trigger för att inkrementera version vid uppdatering
CREATE OR REPLACE FUNCTION increment_version_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.version = OLD.version + 1;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_handbooks_version
BEFORE UPDATE ON handbooks
FOR EACH ROW
EXECUTE FUNCTION increment_version_column(); 