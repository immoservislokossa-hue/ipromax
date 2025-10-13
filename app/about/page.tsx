'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Brain, ShoppingCart, Target, ArrowRight } from 'lucide-react';

// ✅ SEO METADATA
export const metadata = {
  title: "À propos de Epropulse — IA, Formation & Services Digitaux",
  description:
    "Découvrez la mission et la vision d’Epropulse, première plateforme francophone de formation, consulting et services IA. Nous aidons les jeunes, créateurs et entreprises à propulser leur réussite grâce au digital.",
  alternates: {
    canonical: "https://www.epropulse.com/about",
  },
  openGraph: {
    title: "À propos de Epropulse — IA, Formation & Services Digitaux",
    description:
      "Epropulse forme, automatise et propulse la réussite digitale grâce à l'intelligence artificielle, la data et la création de contenu.",
    url: "https://www.epropulse.com/about",
    siteName: "Epropulse",
    images: [
      {
        url: "https://www.epropulse.com/og/epropulse-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Epropulse — Plateforme IA et digitale",
      },
    ],
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos de Epropulse — IA, Formation & Services Digitaux",
    description:
      "Découvrez la mission et les services IA d’Epropulse, la plateforme qui aide les jeunes et entreprises à réussir avec le digital.",
    images: ["https://www.epropulse.com/og/epropulse-1200x630.png"],
    creator: "@epropulse",
  },
  robots: {
    index: true,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: "large",
  },
};

export default function AboutPage() {
  // ✅ Animation
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* --- JSON-LD --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Epropulse",
            url: "https://www.epropulse.com",
            logo: "https://www.epropulse.com/digital-logo.svg",
            sameAs: [
              "https://facebook.com/epropulse",
              "https://twitter.com/epropulse",
              "https://linkedin.com/company/epropulse",
            ],
            description:
              "Epropulse est la première plateforme francophone de formation, consulting et services IA. Elle aide jeunes, freelances et entreprises à réussir grâce au digital et à l'intelligence artificielle.",
            foundingDate: "2024",
            founder: {
              "@type": "Person",
              name: "Emmanuel Adjou",
            },
          }),
        }}
      />

      {/* 🌟 HERO */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 md:py-28 rounded-b-[3rem] overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 opacity-20 bg-[url('/bg-pattern.svg')] bg-cover bg-center"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative max-w-6xl mx-auto px-6 text-center"
        >
          <div className="mb-10 flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl"
            >
              <Image
                src="/emmanueladjou.png"
                alt="Emmanuel Adjou, fondateur d’Epropulse"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
            À propos de <span className="text-yellow-300">Epropulse</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-blue-100"
          >
            La première plateforme francophone dédiée à la <strong>formation</strong>, au{" "}
            <strong>consulting</strong> et aux <strong>services IA</strong> pour
            accompagner les jeunes, freelances et entreprises vers la réussite digitale.
          </motion.p>
        </motion.div>
      </section>

      {/* 🎯 MISSION */}
      <section className="py-16 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Target className="text-blue-600" size={30} />
              Notre mission
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Rendre l’accès à la connaissance, à la technologie et à la croissance
              simple, pratique et rentable.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Chez <strong>Epropulse</strong>, nous croyons que chacun peut grandir s’il dispose
              des bons outils, de la bonne méthode et du bon environnement.
            </p>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/products"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Explorer nos produits <ArrowRight size={18} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-blue-50 rounded-3xl p-6 sm:p-8 shadow-sm text-center">
            <Image
              src="/illustration-mission.png"
              alt="Mission et valeurs d’Epropulse"
              width={500}
              height={400}
              className="mx-auto"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ⚙️ SERVICES */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-[3rem] my-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Nos services et expertises
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Epropulse combine contenu, formation et IA pour propulser les projets digitaux.
            Découvrez nos solutions pour apprendre, créer et automatiser votre croissance.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <ShoppingCart className="text-blue-600" size={40} />,
                title: 'Produits Digitaux',
                text: 'Ebooks, modèles, formations et outils actionnables immédiatement.',
              },
              {
                icon: <BookOpen className="text-blue-600" size={40} />,
                title: 'Apprentissage & Partage',
                text: 'Un blog riche en savoirs concrets sur l’entrepreneuriat digital et la tech.',
              },
              {
                icon: <Brain className="text-blue-600" size={40} />,
                title: 'Services IA & Data',
                text: 'Accompagnement pour l’analyse, l’automatisation et la formation IA.',
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="bg-white rounded-3xl p-8 shadow-md border border-blue-100"
              >
                <div className="flex justify-center mb-4">{s.icon}</div>
                <h3 className="font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 💡 VISION */}
      <section className="py-20 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Notre vision pour l’avenir
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Faire de l’Afrique francophone un pôle mondial d’innovation, de formation et de créativité numérique.
            Unir la compétence, la data et l’IA pour créer de la valeur et un impact durable.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/services"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Découvrir nos services <ArrowRight size={18} className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 🚀 CTA FINAL */}
      <section className="relative py-20 md:py-24 bg-gradient-to-br from-blue-700 to-indigo-800 text-white text-center rounded-t-[3rem] rounded-b-[3rem] overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 opacity-10 bg-[url('/bg-pattern.svg')] bg-cover bg-center"
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Prêt à propulser votre avenir digital ?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Rejoignez des centaines de créateurs et entrepreneurs qui apprennent, créent et grandissent avec Epropulse.
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.div variants={fadeUp} whileHover={{ scale: 1.05 }}>
              <Link
                href="/products"
                className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all inline-flex items-center"
              >
                Commencer maintenant <ArrowRight className="ml-2" size={18} />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} whileHover={{ scale: 1.05 }}>
              <Link
                href="/blog"
                className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition-all inline-flex items-center"
              >
                Lire le blog <ArrowRight className="ml-2" size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
