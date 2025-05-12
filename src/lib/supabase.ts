import { createClient } from '@supabase/supabase-js';
import config from './config';

// Typning för lagring av filer
export interface FileUploadResult {
  path: string;
  url: string;
}

// Skapa Supabase-klienten med URL och anonym nyckel från konfigurationen
const supabase = createClient(
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
 * Spara handbok-data i databasen
 * @param handbookData Handbok-data som ska sparas
 * @returns Promise med den sparade handboken
 */
export async function saveHandbook(handbookData: any) {
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

export default supabase; 