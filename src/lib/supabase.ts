import { createClient } from '@supabase/supabase-js';
import config from './config';
import { Database, Handbook } from '@/types/database';

// Typning för lagring av filer
export interface FileUploadResult {
  path: string;
  url: string;
}

// Skapa Supabase-klienten med URL och anonym nyckel från konfigurationen
const supabase = createClient<Database>(
  config.supabaseUrl,
  config.supabaseAnonKey
);

/**
 * Ladda upp en fil till Supabase Storage
 * @param file Filen som ska laddas upp
 * @param path Sökvägen där filen ska lagras (inklusive filnamn)
 * @param bucket Bucket-namnet där filen ska lagras (standard: 'handbooks')
 * @returns Promise med URL-sökväg till filen
 */
export async function uploadFile(
  file: File,
  path: string,
  bucket: string = 'handbooks'
): Promise<FileUploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw new Error(`Fel vid uppladdning: ${error.message}`);
    }

    // Hämta publik URL för filen
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Fel vid filuppladdning:', error);
    throw error;
  }
}

/**
 * Ta bort en fil från Supabase Storage
 * @param path Sökvägen till filen som ska tas bort
 * @param bucket Bucket-namnet där filen finns (standard: 'handbooks')
 */
export async function deleteFile(path: string, bucket: string = 'handbooks'): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Fel vid borttagning av fil: ${error.message}`);
    }
  } catch (error) {
    console.error('Fel vid borttagning av fil:', error);
    throw error;
  }
}

/**
 * Hämta en lista med filer från Supabase Storage
 * @param prefix Sökvägsprefixet för att filtrera filer (t.ex. 'logos/')
 * @param bucket Bucket-namnet (standard: 'handbooks')
 */
export async function listFiles(prefix?: string, bucket: string = 'handbooks') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix || '');

    if (error) {
      throw new Error(`Fel vid listning av filer: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Fel vid listning av filer:', error);
    throw error;
  }
}

/**
 * Spara handbok-data i databasen
 * @param handbookData Handbok-data som ska sparas
 * @returns Promise med den sparade handboken
 */
export async function saveHandbook(handbookData: Omit<Handbook, 'id' | 'created_at' | 'updated_at' | 'version'>) {
  try {
    const { data, error } = await supabase
      .from('handbooks')
      .insert(handbookData)
      .select()
      .single();

    if (error) {
      throw new Error(`Fel vid sparande av handbok: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Fel vid sparande av handbok:', error);
    throw error;
  }
}

/**
 * Uppdatera betalningsstatus för en handbok
 * @param id Handbokens ID
 * @param paymentId Betalningens ID (från Stripe)
 * @param status Betalningsstatus ('completed', 'failed', etc.)
 */
export async function updatePaymentStatus(
  id: string,
  paymentId: string,
  status: string
) {
  try {
    const { error } = await supabase
      .from('handbooks')
      .update({
        payment_id: paymentId,
        payment_status: status,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Fel vid uppdatering av betalningsstatus: ${error.message}`);
    }
  } catch (error) {
    console.error('Fel vid uppdatering av betalningsstatus:', error);
    throw error;
  }
}

/**
 * Hämta en handbok baserat på ID
 * @param id Handbokens ID
 * @returns Promise med handbok-data
 */
export async function getHandbook(id: string) {
  try {
    const { data, error } = await supabase
      .from('handbooks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Fel vid hämtning av handbok: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Fel vid hämtning av handbok:', error);
    throw error;
  }
}

/**
 * Uppdatera en handbok
 * @param id Handbokens ID
 * @param handbookData Data som ska uppdateras
 */
export async function updateHandbook(id: string, handbookData: Partial<Omit<Handbook, 'id' | 'created_at' | 'updated_at' | 'version'>>) {
  try {
    const { data, error } = await supabase
      .from('handbooks')
      .update(handbookData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Fel vid uppdatering av handbok: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Fel vid uppdatering av handbok:', error);
    throw error;
  }
}

/**
 * Lista alla handböcker
 * @param limit Antal handböcker att hämta
 * @param offset Startposition för pagineringen
 */
export async function listHandbooks(limit: number = 10, offset: number = 0) {
  try {
    const { data, error, count } = await supabase
      .from('handbooks')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Fel vid hämtning av handböcker: ${error.message}`);
    }

    return { data, count };
  } catch (error) {
    console.error('Fel vid hämtning av handböcker:', error);
    throw error;
  }
}

export default supabase; 