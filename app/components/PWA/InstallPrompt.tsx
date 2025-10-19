'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // ⏱ Afficher le bouton après 10 secondes
      const show = setTimeout(() => setVisible(true), 10000);

      return () => clearTimeout(show);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    (deferredPrompt as any).prompt();
    const { outcome } = await (deferredPrompt as any).userChoice;

    if (outcome === 'accepted') {
      console.log('✅ Application installée');
    } else {
      console.log('❌ Installation refusée');
    }

    setDeferredPrompt(null);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="pwa-install"
          onClick={handleInstall}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#0F23E8] text-white font-medium px-5 py-3 rounded-2xl shadow-lg hover:bg-[#0916a8] transition-all"
        >
          <Download size={18} /> Installer l’app
        </motion.button>
      )}
    </AnimatePresence>
  );
}
