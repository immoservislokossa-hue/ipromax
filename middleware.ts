// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const isProtected = path.startsWith("/player"); // ✅ zone protégée
  const isLogin = path === "/login"; // ✅ page publique

  // ✅ Prépare une réponse clonée pour attacher les cookies Supabase
  const res = NextResponse.next({
    request: { headers: req.headers },
  });

  // ✅ Initialise Supabase côté serveur
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    // 🚫 Si erreur liée au token (refresh expiré)
    if (error?.message?.includes("Invalid Refresh Token")) {
      console.warn("⚠️ Token expiré ou invalide. Déconnexion...");
      res.cookies.delete("sb-refresh-token");
      res.cookies.delete("sb-access-token");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🚫 Si utilisateur non connecté et route protégée
    if (isProtected && !user) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(redirectUrl);
    }

    // 🚫 Si déjà connecté et essaie d’accéder à /login
    if (isLogin && user) {
      return NextResponse.redirect(new URL("/player", req.url));
    }

    // ✅ Sinon on continue normalement
    return res;
  } catch (err) {
    console.error("❌ Middleware Supabase error:", err);
    return res;
  }
}

// ✅ S’applique uniquement à ces routes
export const config = {
  matcher: ["/player/:path*", "/login"],
};
