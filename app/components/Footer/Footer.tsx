'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, easeOut } from 'framer-motion';
import DOMPurify from 'dompurify';
import { createClient } from '@supabase/supabase-js';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import {
  BsArrowRight,
  BsClock,
  BsCreditCard,
  BsShieldLock,
} from 'react-icons/bs';

// 🔹 Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function LuxuryFooter() {
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; msg: string }>(
    { type: null, msg: '' }
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://www.facebook.com/propulser', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://www.instagram.com/propulser', label: 'Instagram' },
    { icon: FaTiktok, href: 'https://www.tiktok.com/@propulser', label: 'TikTok' },
    { icon: FaWhatsapp, href: 'https://wa.me/22950505292', label: 'WhatsApp' },
    { icon: FaYoutube, href: 'https://www.youtube.com/propulser', label: 'YouTube' },
  ];

  const infoItems = [
    { icon: BsClock, title: 'Satisfaction 100 %', subtitle: 'Produits testés et approuvés' },
    { icon: BsCreditCard, title: 'Paiement sécurisé', subtitle: 'Mobile Money & carte' },
    { icon: BsShieldLock, title: 'Données protégées', subtitle: 'Sécurité garantie' },
  ];

  const linkColumns = [
    { title: 'BOUTIQUE', items: [{ name: 'Tous les produits', href: '/produits' }] },
    {
      title: 'SERVICES',
      items: [
        { name: 'Tous nos services', href: '/services' },
        { name: 'Consulting', href: '/contact' },
      ],
    },
    {
      title: 'ASSISTANCE',
      items: [
        { name: 'Suivi de commande', href: '/contact' },
        { name: 'Contact WhatsApp', href: 'https://wa.me/2295050523' },
        { name: 'Contact email', href: 'mailto:support@propulser.com' },
      ],
    },
    { title: 'BLOG', items: [{ name: 'Articles récents', href: '/blog' }] },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: null, msg: '' });

    const cleanEmail = DOMPurify.sanitize(email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!emailRegex.test(cleanEmail)) {
      setFeedback({ type: 'error', msg: 'Veuillez entrer un email valide.' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('email').insert({ email: cleanEmail });
      if (error) {
        if (error.code === '23505' || /duplicate/i.test(error.message))
          setFeedback({ type: 'error', msg: 'Cet email est déjà inscrit.' });
        else setFeedback({ type: 'error', msg: 'Une erreur est survenue. Réessayez plus tard.' });
      } else {
        setFeedback({ type: 'success', msg: 'Inscription réussie. Merci !' });
        setEmail('');
      }
    } catch {
      setFeedback({ type: 'error', msg: "Impossible d'envoyer l'email pour le moment." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer
      className={`bg-[#Ffffff] text-black font-poppins w-full overflow-x-hidden mt-10 
        ${isMobile ? 'pb-[90px]' : 'pb-0'}`} 
    >
      <div className="w-[95%] md:w-[80%] mx-auto px-5 md:px-10 py-12 md:py-16 space-y-12">
        {/* 🔹 Haut du footer */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Logo + Réseaux */}
          <motion.div variants={fadeIn} className="lg:max-w-xs w-full">
            <img
              src="/PROPULSER-LOGO.SVG"
              alt="Logo Propulser"
              className="h-10 md:h-12 w-auto mb-3"
            />
            <div className="text-xs uppercase tracking-widest text-[#0F23E8] font-semibold">
              Plateforme digitale premium
            </div>
            <p className="text-sm italic my-4 leading-relaxed text-gray-700">
              “Apprenez, créez et réussissez avec Propulser : formations, ebooks
              et outils digitaux pour professionnels et créateurs.”
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#0F23E8] p-2 rounded-full shadow-sm hover:bg-[#0F23E8] hover:text-white transition-all duration-300"
                >
                  <link.icon size={isMobile ? 14 : 16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Liens */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-6 lg:mt-0">
            {linkColumns.map((col, i) => (
              <motion.div key={i} variants={fadeIn}>
                <h3 className="text-base md:text-lg font-semibold mb-3 border-b border-[#0F23E8] text-[#0F23E8]">
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.items.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={item.href}
                        target={
                          item.href.includes('wa.me') || item.href.includes('mailto')
                            ? '_blank'
                            : '_self'
                        }
                        className="flex items-center text-sm hover:text-[#0A1ACF] transition-all"
                      >
                        <span className="w-1 h-1 bg-[#0F23E8] rounded-full mr-2" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 🔹 Newsletter */}
        <motion.div
          className="p-6 bg-white/60 rounded-xl border border-[#e0e0e0]"
          variants={fadeIn}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold text-[#0F23E8] mb-1">
                RESTEZ CONNECTÉ
              </h3>
              <p className="text-sm text-[#333]">
                Recevez nos offres exclusives et conseils digitaux
              </p>
            </div>
            <div className="flex-1 w-full md:max-w-md">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="flex-1 px-4 py-3 border border-[#0F23E8] rounded-lg focus:ring-2 focus:ring-[#0F23E8] text-sm"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full md:w-auto bg-[#0F23E8] text-white px-5 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#0A1ACF] disabled:opacity-60"
                >
                  <BsArrowRight size={16} />
                  {loading ? 'Envoi…' : "S'abonner"}
                </motion.button>
              </form>
              {feedback.type && (
                <p
                  role="status"
                  className={`mt-2 text-sm ${
                    feedback.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {feedback.msg}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 🔹 Bande infos + bas de page */}
        <div className="pt-10 border-t border-[#e0e0e0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {infoItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                  <item.icon className="text-[#0F23E8]" size={isMobile ? 16 : 20} />
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-[#666]">{item.subtitle}</div>
                </div>
              </motion.div>
            ))}

            {/* WhatsApp direct */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                <FaWhatsapp className="text-[#25D366]" size={isMobile ? 16 : 20} />
              </div>
              <div>
                <div className="text-sm font-semibold">Support WhatsApp</div>
                <div className="text-xs text-[#666]">Réponse rapide</div>
              </div>
            </motion.div>
          </div>

          {/* 🔹 Bas de page */}
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm mt-6">
            <motion.div
              className="flex items-center gap-2 mb-3 md:mb-0"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Développé par
              <img src="/vorian.png" alt="Vorian Logo" className="h-5 md:h-6 w-auto" />
            </motion.div>
            <p>© 2025 PropulseHub – Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
