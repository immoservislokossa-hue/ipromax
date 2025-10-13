'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 * Utilise la session Supabase locale (pas besoin de cookies serveur)
 */
export function useAuthRedirect() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentUser = data.session?.user || null;
        setUser(currentUser);

        if (!currentUser) {
          console.log('🚪 Pas de session, redirection vers /login');
          router.replace('/login');
        }
      } catch (error) {
        console.error('❌ Vérification auth échouée:', error);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Surveille les changements de session (connexion / déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login');
      else setUser(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  return { user, isLoading };
}
