import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';

/**
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 */
export function useAuthRedirect() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.replace('/login');
    }
  }, [session, router]);
}
