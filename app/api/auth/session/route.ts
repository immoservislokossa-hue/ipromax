// app/hooks/useAuthRedirect.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 * Utilise votre système de cookies personnalisé
 */
export function useAuthRedirect() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const { user: userData } = await response.json();
        
        setUser(userData);
        
        if (!userData) {
          console.log('No user found, redirecting to login');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { user, isLoading };
}