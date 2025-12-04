'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ConfigError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuration Requise
          </h1>
        </div>
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Les variables d'environnement Supabase ne sont pas configurées.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h2 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
              Étapes à suivre :
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
              <li>Créez un fichier <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">.env.local</code> à la racine du projet</li>
              <li>Ajoutez vos clés Supabase :
                <pre className="mt-2 bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon`}
                </pre>
              </li>
              <li>Obtenez vos clés sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">supabase.com</a> dans Settings → API</li>
              <li>Redémarrez le serveur de développement</li>
            </ol>
          </div>

          <div className="flex space-x-4 pt-4">
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aller sur Supabase
            </a>
            <Link
              href="/SETUP_INSTRUCTIONS.md"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Voir les instructions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

