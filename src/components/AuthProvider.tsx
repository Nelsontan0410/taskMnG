'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { useAuthStore } from '@/stores/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, clearUser } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      const { user } = await getCurrentUser()
      setUser(user)
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user } = await getCurrentUser()
          setUser(user)
        } else if (event === 'SIGNED_OUT') {
          clearUser()
          router.push('/auth/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setLoading, clearUser, router])

  return <>{children}</>
}
