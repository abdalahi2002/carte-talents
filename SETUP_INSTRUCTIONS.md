# Instructions de Configuration Rapide

## ⚠️ Erreur : Variables d'environnement manquantes

Si vous voyez l'erreur :
```
Error: Your project's URL and Key are required to create a Supabase client!
```

Cela signifie que vous devez configurer vos variables d'environnement Supabase.

## Solution Rapide

### 1. Créer le fichier `.env.local`

À la racine du projet, créez un fichier nommé `.env.local` avec le contenu suivant :

```env
NEXT_PUBLIC_SUPABASE_URL_AB=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY_AB=votre_clé_anon
```

### 2. Obtenir vos clés Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet (ou utilisez un projet existant)
4. Allez dans **Settings** > **API**
5. Copiez :
   - **Project URL** → remplacez `votre_url_supabase`
   - **anon public** key → remplacez `votre_clé_anon`

### 3. Exécuter la migration SQL

1. Dans Supabase, allez dans **SQL Editor**
2. Ouvrez le fichier `supabase/migrations/001_initial_schema.sql`
3. Copiez tout son contenu
4. Collez-le dans l'éditeur SQL de Supabase
5. Cliquez sur **Run**

### 4. Redémarrer le serveur

Après avoir créé le fichier `.env.local`, redémarrez le serveur de développement :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez-le
npm run dev
```

## Exemple de fichier `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL_AB=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_AB=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.exemple
```

⚠️ **Important** : Ne partagez jamais votre fichier `.env.local` publiquement. Il est déjà dans `.gitignore`.

## Vérification

Une fois configuré, vous devriez pouvoir :
- ✅ Voir la page d'accueil sans erreur
- ✅ Créer un compte
- ✅ Vous connecter

## Besoin d'aide ?

Consultez le fichier `SUPABASE_SETUP.md` pour un guide détaillé.

