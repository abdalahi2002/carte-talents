#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env.local')

console.log('🔍 Vérification de la configuration...\n')

if (!fs.existsSync(envPath)) {
  console.log('Le fichier .env.local n\'existe pas.\n')
  console.log('Créez un fichier .env.local à la racine du projet avec :\n')
  console.log('NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon\n')
  console.log('Consultez SETUP_INSTRUCTIONS.md pour plus d\'informations.\n')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')
const hasKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')

if (!hasUrl || !hasKey) {
  console.log('Le fichier .env.local existe mais certaines variables sont manquantes.\n')
  if (!hasUrl) console.log(' NEXT_PUBLIC_SUPABASE_URL manquant')
  if (!hasKey) console.log(' NEXT_PUBLIC_SUPABASE_ANON_KEY manquant')
  console.log('\n Consultez SETUP_INSTRUCTIONS.md pour plus d\'informations.\n')
  process.exit(1)
}

// Vérifier que les valeurs ne sont pas des placeholders
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)

if (urlMatch && urlMatch[1].includes('votre_url')) {
  console.log('  NEXT_PUBLIC_SUPABASE_URL contient encore un placeholder.')
  console.log('   Remplacez-le par votre vraie URL Supabase.\n')
  process.exit(1)
}

if (keyMatch && keyMatch[1].includes('votre_clé')) {
  console.log(' NEXT_PUBLIC_SUPABASE_ANON_KEY contient encore un placeholder.')
  console.log('   Remplacez-le par votre vraie clé Supabase.\n')
  process.exit(1)
}

console.log('Configuration OK !\n')
console.log(' Assurez-vous d\'avoir exécuté la migration SQL dans Supabase.')
console.log('   Fichier : supabase/migrations/001_initial_schema.sql\n')
process.exit(0)

