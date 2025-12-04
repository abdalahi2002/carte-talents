# Configuration des Avatars

## Configuration Supabase Storage

Pour activer l'upload d'avatars, vous devez configurer Supabase Storage :

### 1. Créer le bucket "avatars"

1. Allez dans votre projet Supabase
2. Allez dans **Storage**
3. Cliquez sur **New bucket**
4. Configurez :
   - **Name** : `avatars`
   - **Public bucket** : ✅ Activé (pour que les avatars soient accessibles publiquement)
5. Cliquez sur **Create bucket**

### 2. Configurer les politiques de sécurité

1. Allez dans **Storage** > **Policies** pour le bucket `avatars`
2. Ou exécutez la migration SQL `supabase/migrations/003_storage_setup.sql` dans l'éditeur SQL

Les politiques créées permettent :
-  Les utilisateurs authentifiés peuvent uploader leur propre avatar
-  Les utilisateurs authentifiés peuvent modifier leur propre avatar
-  Les utilisateurs authentifiés peuvent supprimer leur propre avatar
-  Tout le monde peut voir les avatars (lecture publique)

### 3. Structure des fichiers

Les avatars sont stockés dans le bucket `avatars` avec la structure :
```
avatars/
  └── {user_id}/
      └── {user_id}-{timestamp}.{extension}
```

## Utilisation

### Pour les utilisateurs

1. Allez sur votre page de profil (`/profile`)
2. Cliquez sur "Ajouter" ou "Changer" sous votre avatar
3. Sélectionnez une image (JPG, PNG, GIF - max 5 Mo)
4. L'image est automatiquement uploadée et mise à jour

### Pour les développeurs

Le composant `AvatarUpload` gère automatiquement :
-  Validation du type de fichier (images uniquement)
-  Validation de la taille (max 5 Mo)
-  Preview de l'image avant upload
-  Suppression de l'ancien avatar lors du remplacement
-  Mise à jour automatique du profil

Le composant `Avatar` affiche :
-  L'image si un avatar existe
-  Les initiales si pas d'avatar
-  Différentes tailles (sm, md, lg, xl)

## Exemple d'utilisation

```tsx
import Avatar from '@/components/Avatar'
import AvatarUpload from '@/components/AvatarUpload'

// Afficher un avatar
<Avatar
  avatarUrl={profile.avatar_url}
  firstName={profile.first_name}
  lastName={profile.last_name}
  size="md"
/>

// Upload d'avatar
<AvatarUpload
  currentAvatarUrl={profile.avatar_url}
  userId={user.id}
  onUploadComplete={(url) => {
    // Mettre à jour le profil avec la nouvelle URL
    updateProfile({ avatar_url: url })
  }}
  size="lg"
/>
```

## Tailles disponibles

- `sm` : 40px (w-10 h-10)
- `md` : 64px (w-16 h-16)
- `lg` : 80px (w-20 h-20)
- `xl` : 96px (w-24 h-24)

## Limitations

- Taille maximale : 5 Mo
- Formats acceptés : JPG, PNG, GIF
- Les images sont automatiquement redimensionnées par le navigateur (Next.js Image)

## Dépannage

### L'upload ne fonctionne pas

1. Vérifiez que le bucket `avatars` existe dans Supabase Storage
2. Vérifiez que les politiques RLS sont configurées (voir migration 003)
3. Vérifiez que l'utilisateur est authentifié

### L'avatar ne s'affiche pas

1. Vérifiez que le bucket est public
2. Vérifiez que l'URL dans `avatar_url` est correcte
3. Vérifiez les permissions de lecture publique

### Erreur "Bucket not found"

Exécutez la migration `003_storage_setup.sql` ou créez le bucket manuellement dans Supabase Dashboard.

