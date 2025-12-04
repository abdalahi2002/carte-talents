# Carte des Talents - CESI Saint-Nazaire

Plateforme web permettant aux étudiants de décrire leurs compétences, talents, langues, projets personnels, etc., et de générer une carte interactive des talents.

## 🚀 Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Supabase** - Base de données et authentification
- **Zustand** - Gestion d'état
- **Tailwind CSS** - Styling
- **Recharts** - Visualisations de données
- **Lucide React** - Icônes

## 📋 Fonctionnalités

### ✅ Implémentées

1. **Profil Utilisateur**
   - Création et édition de profil
   - Gestion des compétences (techniques, linguistiques, projets, passions)
   - Gestion des langues avec niveaux CECR
   - Gestion des projets personnels avec liens GitHub/URL

2. **Recherche Avancée**
   - Recherche par nom, bio
   - Filtres par compétences, langues, catégories
   - Filtre "Talent Verified" uniquement

3. **Carte Interactive / Nuage de Compétences**
   - Visualisation des top compétences
   - Répartition par catégorie (graphique en secteurs)
   - Répartition par niveau (graphique en barres)
   - Nuage de compétences textuel

4. **Section "Trouver un Collaborateur"**
   - Liste des profils disponibles
   - Envoi de demandes de collaboration
   - Gestion des demandes reçues (accepter/refuser)
   - Suivi des demandes envoyées

5. **Badge "Talent Verified"**
   - Système de vérification par administrateur
   - Page d'administration pour gérer les vérifications
   - Badge visible sur les profils vérifiés

6. **Authentification**
   - Inscription / Connexion
   - Réinitialisation de mot de passe (mot de passe oublié)
   - Gestion de session avec Supabase Auth
   - Protection des routes

## 🛠️ Installation

### Prérequis

- Node.js 18+ 
- Compte Supabase

### Étapes

1. **Cloner le projet**
```bash
git clone <repository-url>
cd carte-talents
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**

   a. Créer un projet sur [Supabase](https://supabase.com)
   
   b. Créer un fichier `.env.local` à la racine du projet :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
   ```

   c. Exécuter la migration SQL dans l'éditeur SQL de Supabase :
   - Ouvrir `supabase/migrations/001_initial_schema.sql`
   - Copier le contenu et l'exécuter dans l'éditeur SQL de Supabase

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du Projet

```
carte-talents/
├── app/                    # Pages Next.js (App Router)
│   ├── auth/              # Pages d'authentification
│   ├── profile/           # Pages de profil
│   ├── search/            # Page de recherche
│   ├── map/               # Page de visualisation
│   ├── collaborate/       # Page de collaboration
│   └── admin/             # Page d'administration
├── components/            # Composants React
├── lib/                   # Utilitaires
│   └── supabase/         # Configuration Supabase
├── store/                 # Stores Zustand
├── types/                 # Types TypeScript
├── supabase/              # Migrations SQL
└── public/               # Assets statiques
```

## 🗄️ Schéma de Base de Données

- **profiles** - Profils utilisateurs
- **skills** - Compétences
- **languages** - Langues
- **projects** - Projets personnels
- **collaboration_requests** - Demandes de collaboration

## 🔐 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Politiques de sécurité configurées
- Authentification via Supabase Auth
- Protection des routes sensibles

## 🎨 Personnalisation

Les styles peuvent être modifiés dans :
- `app/globals.css` - Styles globaux
- Classes Tailwind dans les composants

## 📝 Notes

- Le système de vérification "Talent Verified" nécessite des droits administrateur
- La page `/admin` est accessible à tous les utilisateurs connectés (à restreindre selon vos besoins)
- Les migrations SQL doivent être exécutées dans l'ordre

## 🚀 Déploiement

### Vercel (Recommandé)

1. Pousser le code sur GitHub
2. Importer le projet dans Vercel
3. Ajouter les variables d'environnement Supabase
4. Déployer

### Autres plateformes

Le projet peut être déployé sur toute plateforme supportant Next.js :
- Netlify
- Railway
- AWS Amplify
- etc.

## 📧 Contact

Pour toute question ou problème, contactez : jgallet@cesi.fr

## 📄 Licence

Ce projet a été créé pour le défi "Nuit de l'Info" - CESI Saint-Nazaire
