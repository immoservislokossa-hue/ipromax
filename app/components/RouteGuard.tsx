// components/RouteGuard.tsx
'use client'

import { ReactNode } from 'react'
import { useAuthRedirect } from '../hooks/useAuthRedirect'
import AuthLoader from './AuthLoader'

interface RouteGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function RouteGuard({ 
  children, 
  fallback = <AuthLoader />
}: RouteGuardProps) {
  const { loading, user } = useAuthRedirect()

  console.log('🛡️ RouteGuard - loading:', loading, 'user:', user?.email)

  if (loading) {
    return <>{fallback}</>
  }

  return <>{children}</>
}