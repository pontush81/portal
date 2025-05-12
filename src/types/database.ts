/**
 * Typfil för databasstrukturer
 */

export interface Handbook {
  id: string;
  created_at: string;
  updated_at: string;
  association_name: string;
  association_type: string;
  address: string | null;
  zip_code: string | null;
  city: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_person: string | null;
  logo_url: string | null;
  selected_sections: string[] | null;
  custom_information: string | null;
  customer_email: string;
  pdf_url: string | null;
  site_url: string | null;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_id: string | null;
  version: number;
}

export interface StorageObject {
  id: string;
  bucket_name: string;
  object_path: string;
  content_type: string | null;
  created_at: string;
  updated_at: string;
  size: number | null;
}

export interface Database {
  public: {
    Tables: {
      handbooks: {
        Row: Handbook;
        Insert: Omit<Handbook, 'id' | 'created_at' | 'updated_at' | 'version'>;
        Update: Partial<Omit<Handbook, 'id' | 'created_at' | 'updated_at' | 'version'>>;
      };
      storage_objects: {
        Row: StorageObject;
        Insert: Omit<StorageObject, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StorageObject, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
} 