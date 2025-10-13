"use client";

import ContactForm from "@/app/components/services/ContactForm";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { services } from "@/app/services/data/services";

export default function ClientCommandesPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const serviceSlug = searchParams.get("service");
  const slug = params?.slug as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Récupérer le service correspondant au slug
  const currentService = serviceSlug 
    ? services.find(s => s.slug === serviceSlug)
    : null;

  const currentServiceName = currentService?.title || "Service personnalisé";

  return (
    <div className="min-h-screen  px-4 relative overflow-hidden">
  
     

      {/* --- Content wrapper --- */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
         

          {/* Titre principal */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Demander un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Devis</span>
          </h1>

       
      
        </motion.div>

        {/* --- Form Section --- */}
        <motion.div
          
        >
          <ContactForm />
        </motion.div>

        {/* --- Assurance confidentialité --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-100"
        >
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>
              Vos informations restent <strong className="text-blue-600">confidentielles et sécurisées</strong>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Nous ne partageons jamais vos données avec des tiers
          </p>
        </motion.div>

      
      </div>
    </div>
  );
}