'use client';

import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Affiche le bouton 5 secondes après l'arrivée
      const showTimeout = setTimeout(() => {
        setIsVisible(true);

        // Le cache disparaît automatiquement 5 secondes après l'apparition
        const hideTimeout = setTimeout(() => setIsVisible(false), 5000);
        return () => clearTimeout(hideTimeout);
      }, 5000);

      return () => clearTimeout(showTimeout);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      console.log('✅ App installée');
    } else {
      console.log('❌ Installation refusée');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    isVisible && (
      <button
        onClick={handleInstallClick}
        className="fixed bottom-20 right-4 bg-[#0F23E8] text-white px-4 py-2 rounded-xl shadow-lg transition-opacity duration-500"
      >
        Installer l’app 🚀
      </button>
    )
  );
}
