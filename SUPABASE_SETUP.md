# Configuration Supabase

Ce guide vous explique comment configurer Supabase pour le projet "Carte des Talents".

## Étape 1 : Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : carte-talents (ou autre nom)
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche
5. Cliquez sur "Create new project"

## Étape 2 : Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez les valeurs suivantes :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Étape 3 : Configurer les variables d'environnement

1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

## Étape 4 : Exécuter la migration SQL

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur "New query"
3. Ouvrez le fichier `supabase/migrations/001_initial_schema.sql` dans votre éditeur
4. Copiez tout le contenu du fichier
5. Collez-le dans l'éditeur SQL de Supabase
6. Cliquez sur "Run" ou appuyez sur `Ctrl+Enter`

Cette migration va créer :
- Les tables : `profiles`, `skills`, `languages`, `projects`, `collaboration_requests`
- Les index pour optimiser les performances
- Les politiques RLS (Row Level Security) pour la sécurité
- Un trigger pour créer automatiquement un profil lors de l'inscription

## Étape 5 : Configurer l'authentification

1. Dans Supabase, allez dans **Authentication** > **URL Configuration**
2. Configurez les paramètres :
   - **Site URL** : `http://localhost:3000` (pour le développement) ou votre URL de production
   - **Redirect URLs** : Ajoutez les URLs suivantes :
     - `http://localhost:3000/auth/reset-password` (pour le développement)
     - `http://localhost:3000/**` (pour toutes les redirections en développement)
     - Votre URL de production + `/auth/reset-password` (pour la production)

    **Important** : Pour la réinitialisation de mot de passe, vous devez ajouter l'URL de redirection dans la liste des URLs autorisées.

## Étape 6 : Tester la configuration

1. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Allez sur `http://localhost:3000`
3. Essayez de créer un compte
4. Vérifiez dans Supabase > **Authentication** > **Users** qu'un nouvel utilisateur a été créé
5. Vérifiez dans Supabase > **Table Editor** > **profiles** qu'un profil a été créé automatiquement

## Vérification

Pour vérifier que tout fonctionne :

1. ✅ Les tables sont créées dans Supabase
2. ✅ Les politiques RLS sont actives
3. ✅ Vous pouvez créer un compte
4. ✅ Un profil est créé automatiquement
5. ✅ Vous pouvez vous connecter

## Problèmes courants

### Erreur : "relation does not exist"
- Vérifiez que la migration SQL a bien été exécutée
- Vérifiez que vous êtes dans le bon projet Supabase

### Erreur : "new row violates row-level security policy"
- Vérifiez que les politiques RLS sont bien créées
- Vérifiez que vous êtes connecté avec un utilisateur valide

### Erreur : "Invalid API key"
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que vous utilisez la clé "anon public" et non la clé "service_role"

## Notes importantes

-  Ne partagez jamais votre clé `service_role` publiquement
-  La clé `anon` est publique mais sécurisée par les politiques RLS
-  Pour la production, mettez à jour les URLs de redirection dans Supabase

