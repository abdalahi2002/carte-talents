'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import ConfigError from '@/components/ConfigError'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, fetchProfile } = useAuthStore()
  const [configError, setConfigError] = useState<string | null>(null)

  useEffect(() => {
    let supabase
    try {
      supabase = createClient()
    } catch (error: any) {
      setConfigError(error.message)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile()
      } else {
        setLoading(false)
      }
    }).catch((error) => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile()
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading, fetchProfile])

  if (configError) {
    return <ConfigError />
  }

  return <>{children}</>
}

