import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier le token dans le localStorage
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (password: string) => {
    try {
      // TODO: Implémenter une véritable authentification avec une API
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        const token = 'fake-token'; // Utiliser un vrai JWT dans une vraie implémentation
        localStorage.setItem('adminToken', token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
}
