/**
 * Konfigurationsfil för applikationen
 */

interface Config {
  productName: string;
  productPrice: number;
  productCurrency: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  openaiApiKey?: string;
  stripePublishableKey?: string;
  isProduction: boolean;
}

const config: Config = {
  productName: 'Föreningshandboken',
  productPrice: 299,
  productCurrency: 'sek',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  isProduction: process.env.NODE_ENV === 'production',
};

// Kontrollera att nödvändiga miljövariabler är satta
if (!config.supabaseUrl || !config.supabaseAnonKey) {
  console.warn('Saknade Supabase-miljövariabler. Se .env.local.example för instruktioner.');
}

export default config; 