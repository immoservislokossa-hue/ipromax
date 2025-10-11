"use client";

import ContactForm from "@/app/components/services/ContactForm";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeftCircle } from "react-icons/fi";

export default function ClientCommandesPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const service = searchParams.get("service");
  const slug = params?.slug as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const serviceNames: Record<string, string> = {
    musique: "Création de Musique IA",
    photoshooting: "Photoshooting IA",
    video: "Vidéo Promotionnelle IA",
    livre: "Rédaction de Livre IA",
    "design-graphique": "Design Graphique IA",
    "chatbot-whatsapp": "Chatbot WhatsApp",
    "automation-marketing": "Automatisation Marketing",
    "chatbot-site": "Chatbot Site Web",
    "assistant-entreprise": "Assistant Virtuel Entreprise",
    "analyse-donnees": "Analyse de Données IA",
  };

  const currentServiceName = service ? serviceNames[service] : "Service personnalisé";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2FF] via-white to-[#E9EDFF] py-20 px-4 relative overflow-hidden font-poppins">
      {/* --- Gradient tech background --- */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-[140px]"></div>
      </div>

      {/* --- Content wrapper --- */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <Link
            href={`/services/${slug}`}
            className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-300 mb-8"
          >
            <FiArrowLeftCircle className="mr-2 text-lg" />
            Retour au service
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Demander un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Devis</span>
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm border border-blue-100"
          >
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            {currentServiceName}
          </motion.div>
        </motion.div>

        {/* --- Form Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 hover:shadow-2xl transition-all duration-700"
        >
          <ContactForm />
        </motion.div>

        {/* --- Small footer --- */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          Vos informations restent <strong className="text-blue-600">confidentielles</strong>.
        </motion.p>
      </div>
    </div>
  );
}
