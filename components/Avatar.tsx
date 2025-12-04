'use client'

import Image from 'next/image'

interface AvatarProps {
  avatarUrl?: string
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Avatar({ avatarUrl, firstName, lastName, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-24 h-24 text-2xl',
  }

  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()

  if (avatarUrl) {
    return (
      <div className={`${sizeClasses[size]} ${className} relative rounded-full overflow-hidden`}>
        <Image
          src={avatarUrl}
          alt={`${firstName} ${lastName}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 64px, 80px"
        />
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full bg-blue-600 flex items-center justify-center text-white font-bold`}>
      {initials || '?'}
    </div>
  )
}

