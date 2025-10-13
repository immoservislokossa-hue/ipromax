'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, Lock, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HoneypotAdmin() {
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/log-intrusion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: window.location.pathname }),
        });
        const json = await res.json();
        if (json.ok) setStatus('sent');
        else setStatus('error');
      } catch (e) {
        setStatus('error');
      }
    })();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-lg bg-gray-800/90 border border-red-700 rounded-2xl p-8 shadow-xl text-center">
        <ShieldAlert className="mx-auto text-red-500 w-12 h-12 mb-4" />
        <h1 className="text-2xl font-bold text-red-400 mb-2">Accès réservé</h1>

        <p className="text-sm text-gray-300 mb-4">
          Vous tentez d'accéder à une zone protégée. Cette activité a été enregistrée
          et sera examinée par notre équipe de sécurité.  Tous les Admin et Modérateurs sont aussi alertés.
        </p>

        <div className="bg-red-900/10 border border-red-800 rounded-lg p-3 text-xs text-red-200 mb-4">
          Les informations techniques collectées : adresse IP (enregistrée), navigateur,
         
        </div>

        <div className="text-xs text-gray-400 mb-4">
          {status === 'idle' && 'Enregistrement de l’activité...'}
          {status === 'sent' && 'Activité signalée à l’administrateur.'}
          {status === 'error' && 'oops.'}
        </div>

        <div className="flex justify-center gap-3">
          <Link href="/" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
            Retourner
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">Epropulse Security • {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
