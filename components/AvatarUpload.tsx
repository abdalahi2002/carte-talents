'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface AvatarUploadProps {
  currentAvatarUrl?: string
  userId: string
  onUploadComplete: (url: string) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function AvatarUpload({ currentAvatarUrl, userId, onUploadComplete, size = 'md' }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5 Mo')
      return
    }

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    await uploadAvatar(file)
  }

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true)

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        // Extract path from URL (format: .../avatars/user_id/filename)
        const urlParts = currentAvatarUrl.split('/avatars/')
        if (urlParts.length > 1) {
          const oldPath = urlParts[1]
          try {
            await supabase.storage.from('avatars').remove([oldPath])
          } catch (error) {
            console.warn('Could not delete old avatar:', error)
          }
        }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      onUploadComplete(publicUrl)
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      alert('Erreur lors de l\'upload de l\'avatar')
      setPreview(currentAvatarUrl || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!currentAvatarUrl) return

    try {
      setUploading(true)
      // Extract path from URL (format: .../avatars/user_id/filename)
      const urlParts = currentAvatarUrl.split('/avatars/')
      if (urlParts.length > 1) {
        const oldPath = urlParts[1]
        await supabase.storage.from('avatars').remove([oldPath])
      }
      onUploadComplete('')
      setPreview(null)
    } catch (error) {
      console.error('Error removing avatar:', error)
      alert('Erreur lors de la suppression de l\'avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700`}>
        {preview ? (
          <Image
            src={preview}
            alt="Avatar"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, 96px"
          />
        ) : (
          <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            ?
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Upload...' : preview ? 'Changer' : 'Ajouter'}</span>
          </div>
        </label>
        {preview && (
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
            <span>Supprimer</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Formats acceptés: JPG, PNG, GIF (max 5 Mo)
      </p>
    </div>
  )
}

