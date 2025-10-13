import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ✅ Les routes protégées (ton dashboard)
const PROTECTED_PATHS = ['/player']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const url = req.nextUrl.clone()

  // 🔓 Routes publiques → accès libre
  if (!PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 🕵️ Vérifie si un token Supabase est présent
  const accessToken = req.cookies.get('sb-access-token')?.value

  // 🚫 Pas de token → redirection immédiate
  if (!accessToken) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ✅ Token présent → accès autorisé
  return NextResponse.next()
}

// 🧭 Configuration du middleware
export const config = {
  matcher: [
    '/player/:path*', // protège toutes les sous-routes de /player
  ],
}
