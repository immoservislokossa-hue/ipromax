'use client'

import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { BsArrowRight, BsGeoAlt, BsClock, BsCreditCard, BsShieldLock } from 'react-icons/bs'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, easeOut } from 'framer-motion'

export default function LuxuryFooter() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
  }

  const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/propulser", label: "Facebook" },
    { icon: FaInstagram, href: "https://www.instagram.com/propulser", label: "Instagram" },
    { icon: FaTiktok, href: "https://www.tiktok.com/@propulser", label: "TikTok" },
    { icon: FaWhatsapp, href: "https://wa.me/22950505523", label: "Communauté WhatsApp" },
    { icon: FaYoutube, href: "https://www.youtube.com/ihanna", label: "YouTube" },
  ]

  const infoItems = [
    { icon: BsClock, title: 'Satisfaction 100 %', subtitle: 'Tous nos produits ont été testés' },
    { icon: BsCreditCard, title: 'Paiement sécurisé', subtitle: 'Mobile money ou carte' },
    { icon: BsShieldLock, title: 'Sécurité garantie', subtitle: 'Données 100% protégées' }
  ]

  const linkColumns = [
    { 
      title: 'BOUTIQUE', 
      items: [
        { name: 'Nouveautés', href: '/nouveautes' },
        { name: 'Meilleures ventes', href: '/meilleures-ventes' },
        { name: 'Promotions', href: '/promotions' },
        { name: 'Tous les produits', href: '/boutique' }
      ] 
    },
    { 
      title: 'SERVICES', 
      items: [
        { name: 'Tous nos services', href: '/services' },
        { name: 'Formations', href: '/services#formations' },
        { name: 'Ebooks', href: '/services#ebooks' },
        { name: 'Outils digitaux', href: '/services#outils' },
        { name: 'Consulting', href: '/services#consulting' }
      ] 
    },
    { 
      title: 'ASSISTANCE', 
      items: [
        { name: 'Suivi de commande', href: '/suivi-commande' },
        { name: 'Contact WhatsApp', href: 'https://wa.me/22950505523' },
        { name: 'Centre d\'aide', href: '/aide' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact email', href: 'mailto:support@propulser.com' }
      ] 
    },
    { 
      title: 'BLOG', 
      items: [
        { name: 'Articles récents', href: '/blog' },
        { name: 'Tutoriels', href: '/blog?category=tutoriels' },
        { name: 'Conseils pro', href: '/blog?category=conseils' },
        { name: 'Actualités', href: '/blog?category=actualites' }
      ] 
    }
  ]

  return (
    <footer className="bg-[#F2F2FF] text-[#000000] font-poppins">
      {/* Bandeau d'information important - Mobile first */}
      <div className="md:hidden bg-[#0F23E8] text-white py-3 px-4">
        <div className="flex flex-col space-y-3">
          {/* Contact WhatsApp urgent */}
          <motion.a
            href="https://wa.me/22950505523"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-[#25D366] text-white py-2 px-4 rounded-lg font-medium text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaWhatsapp className="mr-2" size={18} />
            Contact WhatsApp
          </motion.a>
          
          {/* Suivi de commande */}
          <motion.a
            href="/suivi-commande"
            className="flex items-center justify-center bg-white text-[#0F23E8] py-2 px-4 rounded-lg font-medium text-sm border border-[#0F23E8]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BsGeoAlt className="mr-2" />
            Suivi de commande
          </motion.a>
        </div>
      </div>

      {/* Branding + Social */}
      <div className="container mx-auto px-4 py-8 md:py-16 border-t border-[#e0e0e0]">
        <motion.div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12" initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={fadeIn} className="lg:max-w-xs">
            <img src="/PROPULSER-LOGO.SVG" alt="Propulser Logo" className="h-10 md:h-12 w-auto mb-2" />
            <div className="text-xs uppercase tracking-widest text-[#0F23E8] mt-1 font-semibold">Plateforme digitale premium</div>
            <p className="text-[#000000] text-sm italic my-4">
              "Apprenez, créez et réussissez avec Propulser : formations, ebooks et outils digitaux pour professionnels et créateurs."
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, color: '#0A1ACF' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#FFFFFF] text-[#0F23E8] p-2 md:p-3 rounded-full shadow transition-all duration-300 hover:bg-[#0F23E8] hover:text-[#F2F2FF]"
                >
                  <link.icon size={isMobile ? 14 : 16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Colonnes de liens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full mt-6 md:mt-0">
            {linkColumns.map((col, i) => (
              <motion.div key={i} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 pb-2 border-b border-[#0F23E8] text-[#0F23E8] tracking-wider">{col.title}</h3>
                <ul className="space-y-2 md:space-y-3">
                  {col.items.map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        href={item.href} 
                        className="hover:text-[#0A1ACF] transition-all duration-300 flex items-center group text-sm md:text-base"
                        target={item.href.includes('wa.me') || item.href.includes('mailto') ? '_blank' : '_self'}
                      >
                        <span className="w-1 h-1 bg-[#0F23E8] rounded-full mr-2 group-hover:animate-ping"></span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div 
          className="mt-8 md:mt-12 p-6 bg-white rounded-lg shadow-sm border border-[#e0e0e0]"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-medium text-[#0F23E8] mb-2">RESTEZ CONNECTÉ</h3>
              <p className="text-sm text-[#000000]">
                Recevez nos offres exclusives et conseils digitaux
              </p>
            </div>
            <div className="flex-1 w-full md:max-w-md">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-3 border border-[#0F23E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F23E8] text-sm"
                />
                <motion.button 
                  className="bg-[#0F23E8] text-[#F2F2FF] px-6 py-3 rounded-lg hover:bg-[#0A1ACF] transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BsArrowRight size={16} />
                  <span className="hidden sm:inline">S'abonner</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Zone basse - infos principales */}
      <div className="bg-[#F2F2FF] py-6 md:py-8 border-y border-[#e0e0e0]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {infoItems.map((item, index) => (
              <motion.div 
                key={index} 
                className="flex items-center justify-start"
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-[#FFFFFF] p-2 md:p-3 rounded-full mr-3 shadow-sm">
                  <item.icon className="text-[#0F23E8]" size={isMobile ? 16 : 20} />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#000000]">{item.title}</div>
                  <div className="text-xs text-[#666]">{item.subtitle}</div>
                </div>
              </motion.div>
            ))}
            
            {/* Contact WhatsApp */}
            <motion.div 
              className="flex items-center justify-start"
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
            >
              <div className="bg-[#FFFFFF] p-2 md:p-3 rounded-full mr-3 shadow-sm">
                <FaWhatsapp className="text-[#25D366]" size={isMobile ? 16 : 20} />
              </div>
              <div>
                <div className="text-sm font-medium text-[#000000]">Contact WhatsApp</div>
                <div className="text-xs text-[#666]">Support immédiat</div>
              </div>
            </motion.div>

           
          </div>
        </div>
      </div>

      {/* Mentions finales / copyright */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="text-sm text-[#000000] text-center md:text-left mb-4 md:mb-0"
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
          >
            © 2025 PropulseHub – Tous droits réservés. 
          
          </motion.div>

          <motion.div 
            className="flex items-center"
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="text-sm text-[#000000] flex items-center">
              Développé par
              <img src="/vorian.png" alt="Vorian Logo" className="inline h-5 md:h-6 w-auto mx-2 align-middle" />
            </div>
          </motion.div>
        </div>
      </div>



      {/* Barre fixe mobile pour les actions importantes */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around items-center shadow-lg z-50">
          <Link 
            href="/suivi-commande" 
            className="flex flex-col items-center text-[#0F23E8]"
          >
            <BsGeoAlt size={20} />
            <span className="text-xs mt-1">Suivi</span>
          </Link>
          <Link 
            href="https://wa.me/22950505523" 
            className="flex flex-col items-center text-[#25D366]"
            target="_blank"
          >
            <FaWhatsapp size={20} />
            <span className="text-xs mt-1">WhatsApp</span>
          </Link>
          <Link 
            href="/nouveautes" 
            className="flex flex-col items-center text-[#0F23E8]"
          >
        
            <span className="text-xs mt-1">Nouveautés</span>
          </Link>
          <Link 
            href="/promotions" 
            className="flex flex-col items-center text-[#FF6F00]"
          >
           
            <span className="text-xs mt-1">Promos</span>
          </Link>
        </div>
      )}
    </footer>
  )
}