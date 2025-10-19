'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '../utils/supabase/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // ✅ Vérifie si déjà connecté
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        redirectToPlayer()
      }
    }
    checkAuth()
  }, [])

  const redirectToPlayer = () => {
    const redirectedFrom = searchParams.get('redirectedFrom')
    const target = redirectedFrom || '/player'
    router.replace(target)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!email.trim() || !password) {
        setError('Veuillez remplir tous les champs.')
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Format d'email invalide.")
        return
      }

      console.log('🔐 Tentative de connexion pour', email)
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (authError) throw new Error('Identifiants incorrects.')
      if (!data.user) throw new Error('Utilisateur introuvable.')

      console.log('✅ Connexion réussie.')
      await new Promise((r) => setTimeout(r, 500))
      redirectToPlayer()
    } catch (err: any) {
      console.error('💥 Erreur:', err)
      setError(err.message || 'Erreur inconnue.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-blue-600">
      <form
        onSubmit={handleLogin}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full"
        autoComplete="off"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          className="w-full p-3 mb-4 bg-neutral-800 border border-neutral-700 rounded focus:ring-2 focus:ring-blue-500 transition"
          disabled={isLoading}
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full p-3 mb-6 bg-neutral-800 border border-neutral-700 rounded focus:ring-2 focus:ring-blue-500 transition"
          disabled={isLoading}
          required
        />

        {error && (
          <div className="p-3 mb-4 bg-red-900/50 border border-red-700 text-red-300 rounded text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 py-3 rounded font-semibold transition flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connexion...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>
    </main>
  )
}

// ✅ Fix officiel Next.js 15
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400 py-10">Chargement...</div>}>
      <LoginForm />
    </Suspense>
  )
}
