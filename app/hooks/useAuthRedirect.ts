'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * ✅ Hook: useAuthRedirect
 * Redirige automatiquement les utilisateurs non connectés vers /login
 */
export function useAuthRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        const redirectTo = searchParams.get('redirectedFrom') || '/player'
        router.replace(`/login?redirectedFrom=${redirectTo}`)
        return
      }

      if (mounted) {
        setUser(data.user)
        setLoading(false)
      }
    }

    checkUser()

    return () => {
      mounted = false
    }
  }, [supabase, router, searchParams])

  return { user, loading }
}
