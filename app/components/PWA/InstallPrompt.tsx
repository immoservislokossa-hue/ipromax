'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Afficher après 9 secondes de visite
      const show = setTimeout(() => setVisible(true), 9000);

      return () => clearTimeout(show);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      // Disparaît après 8 secondes
      const timer = setTimeout(() => {
        setVisible(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

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

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pwa-install"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo E-Propulse */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0F23E8] to-[#3B82F6] rounded-lg flex items-center justify-center">
                    <Download size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">Epropulse</span>
                </div>
                
                {/* Séparateur */}
                <div className="w-px h-6 bg-gray-300"></div>
                
                {/* Texte d'installation */}
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors group"
                >
                  <Download size={16} className="text-[#0F23E8] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Installer l'app</span>
                </button>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Barre de progression */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0F23E8] to-[#3B82F6]"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 8, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}