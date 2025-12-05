import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_AB
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_AB

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Variables d\'environnement Supabase non configurées. Veuillez créer un fichier .env.local avec NEXT_PUBLIC_SUPABASE_URL_AB et NEXT_PUBLIC_SUPABASE_ANON_KEY_AB. Consultez SETUP_INSTRUCTIONS.md pour plus d\'informations.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

