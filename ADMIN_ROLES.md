# Guide des Rôles Administrateurs

## Rôles Disponibles

Le système utilise deux rôles pour gérer les permissions :

### 1. **user** (par défaut)
- Rôle attribué automatiquement à tous les nouveaux utilisateurs
- Peut créer et modifier son propre profil
- Peut ajouter ses compétences, langues et projets
- Peut rechercher d'autres profils (étudiants uniquement)
- Peut envoyer des demandes de collaboration
- **N'apparaît pas dans les résultats de recherche** (seuls les étudiants sont visibles)
- **N'apparaît pas dans les collaborations** (seuls les étudiants sont disponibles)

### 2. **admin** (Administrateur)
- Toutes les permissions d'un **user**
- **Peut vérifier les talents** (attribuer le badge "Talent Verified")
- **Peut modifier les niveaux de compétences** des étudiants
- Accès à la page `/admin` pour gérer les vérifications
- Accès à la page `/admin/[id]` pour voir les détails d'un étudiant et modifier ses compétences
- **N'apparaît pas dans les résultats de recherche** (pour garder la confidentialité)
- **N'apparaît pas dans les collaborations** (pour éviter les contacts non souhaités)

## Comment Attribuer un Rôle

### Via SQL (Recommandé pour créer le premier admin)

1. Connectez-vous à Supabase
2. Allez dans **SQL Editor**
3. Exécutez cette requête (remplacez `votre_email@example.com` par l'email de l'utilisateur) :

```sql
-- Créer le premier administrateur
UPDATE profiles
SET role = 'admin'
WHERE email = 'votre_email@example.com';
```

#### Attribuer le rôle d'utilisateur standard

```sql
UPDATE profiles
SET role = 'user'
WHERE email = 'utilisateur@example.com';
```

## Migration des Rôles

Si vous avez déjà des utilisateurs dans votre base de données, exécutez cette migration :

1. Allez dans **SQL Editor** de Supabase
2. Ouvrez le fichier `supabase/migrations/002_add_roles.sql`
3. Copiez tout le contenu
4. Collez dans l'éditeur SQL
5. Cliquez sur **Run**

Cette migration va :
- Ajouter la colonne `role` à la table `profiles`
- Définir tous les utilisateurs existants comme `user` par défaut
- Créer les politiques RLS pour sécuriser les mises à jour

## Fonctionnalités Administrateur

### Page `/admin`
- Liste tous les étudiants (pas les admins)
- Permet de rechercher des étudiants
- Permet de vérifier/retirer le badge "Talent Verified"
- Affiche un lien "Voir détails" pour chaque étudiant

### Page `/admin/[id]`
- Affiche toutes les informations d'un étudiant :
  - Profil complet
  - Compétences avec possibilité de modifier les niveaux
  - Langues
  - Projets
- Permet de vérifier/retirer le badge "Talent Verified"
- Permet de modifier le niveau de chaque compétence

## Sécurité

### Politiques RLS (Row Level Security)

Les politiques suivantes sont en place :

1. **Utilisateurs** : Peuvent modifier leur propre profil (sauf `role` et `verified`)
2. **Admins** : Peuvent modifier le champ `verified` de tous les profils
3. **Admins** : Peuvent modifier les niveaux de compétences de tous les profils
4. **Admins uniquement** : Peuvent modifier le champ `role` de tous les profils

### Filtrage des Admins

- Les admins **ne sont pas visibles** dans :
  - La recherche de talents (`/search`)
  - La section collaboration (`/collaborate`)
- Cela garantit que seuls les étudiants sont visibles publiquement

## Workflow Recommandé

1. **Créer le premier admin** via SQL (voir ci-dessus)
2. **Se connecter** avec ce compte admin
3. **Aller sur `/admin`** pour voir tous les étudiants
4. **Cliquer sur "Voir détails"** pour un étudiant
5. **Modifier les niveaux de compétences** si nécessaire
6. **Vérifier le talent** si les compétences sont validées

## Dépannage

### "Accès Refusé" sur `/admin`

- Vérifiez que votre profil a le rôle `admin`
- Vérifiez dans Supabase > Table Editor > profiles que votre `role` est bien défini à `admin`

### Impossible de modifier les compétences

- Vérifiez que vous êtes connecté avec un compte ayant le rôle `admin`
- Vérifiez que vous êtes sur la page `/admin/[id]` d'un étudiant (pas d'un admin)

### Les politiques RLS bloquent les mises à jour

- Vérifiez que la migration `002_add_roles.sql` a bien été exécutée
- Vérifiez que votre rôle est correctement défini dans la table `profiles`

## Exemple de Requête SQL

Pour voir tous les administrateurs :

```sql
SELECT first_name, last_name, email, role, created_at
FROM profiles
WHERE role = 'admin'
ORDER BY created_at;
```

Pour voir tous les étudiants :

```sql
SELECT first_name, last_name, email, role, verified, created_at
FROM profiles
WHERE role = 'user'
ORDER BY created_at;
```
