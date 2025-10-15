'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DOMPurify from 'dompurify';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
} from 'react-icons/fi';
import SEO from '@/components/Seo'; // ton composant SEO réutilisable

export default function ContactPage() {
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honey: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => setStartTime(Date.now()), []);

  /** --- Validation stricte --- **/
  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return false;
    if (formData.message.length < 5) return false;
    return true;
  };

  /** --- Nettoyage sécurisé DOMPurify --- **/
  const sanitize = (text: string) => {
    const clean = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return clean.replace(/[<>$]/g, '').trim().slice(0, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** --- Soumission sécurisée --- **/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const delayPassed = startTime ? Date.now() - startTime > 2000 : false;
    if (!delayPassed || formData.honey.trim() !== '') {
      alert('Tentative suspecte détectée. Votre IP est enregistrée.');
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      alert('Veuillez remplir correctement tous les champs requis.');
      setIsSubmitting(false);
      return;
    }

    if (attempts >= 3) {
      alert('Trop de tentatives. Veuillez réessayer plus tard.');
      setIsSubmitting(false);
      return;
    }

    setAttempts((prev) => prev + 1);

    try {
      const { error } = await supabase.from('messagepro').insert([
        {
          name: sanitize(formData.name),
          email: sanitize(formData.email),
          content: sanitize(formData.message),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setIsSent(true);
      setFormData({ name: '', email: '', message: '', honey: '' });
    } catch (err) {
      console.error('Erreur lors de l’envoi :', err);
      alert('❌ Une erreur est survenue. Réessayez plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /** --- Message de succès --- **/
  if (isSent) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4">
        <SEO
          title="Message envoyé avec succès"
          description="Merci d’avoir contacté Epropulse. Votre message a bien été envoyé, notre équipe vous répondra rapidement."
          canonical="https://www.epropulse.com/contact"
          type="ContactPage"
        />
        <div className="bg-white border border-blue-200 shadow-xl rounded-3xl p-10 text-center max-w-md animate-fade-in">
          <FiCheckCircle className="text-blue-600 text-6xl mb-3 mx-auto" />
          <h1 className="text-2xl font-bold text-blue-700 mb-2">
            Message envoyé avec succès 🎉
          </h1>
          <p className="text-gray-600">
            Merci pour votre message 💬 <br /> Nous vous répondrons sous peu.
          </p>
          <button
            onClick={() => setIsSent(false)}
            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Envoyer un autre message
          </button>
        </div>
      </main>
    );
  }

  /** --- Contenu principal --- **/
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <SEO
        title="Contact"
        description="Contactez Epropulse — la plateforme IA & Digital francophone pour entrepreneurs, créateurs et entreprises. Notre équipe vous répond sous 24h."
        canonical="https://www.epropulse.com/contact"
        type="ContactPage"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          'mainEntity': {
            '@type': 'Organization',
            'name': 'Epropulse',
            'url': 'https://www.epropulse.com',
            'logo': 'https://www.epropulse.com/logo.png',
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': '+2290150505292',
              'contactType': 'customer support',
              'availableLanguage': ['French'],
            },
          },
        }}
      />

      {/* HERO */}
      <section className="relative flex flex-col items-center text-center py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
          Contactez-nous
        </h1>
        <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
          Une idée, un projet ou une question ? <br />
          <span className="text-white font-semibold">
            L’équipe Epropulse vous répond rapidement.
          </span>
        </p>
        <div className="absolute bottom-0 w-full h-16 bg-white rounded-t-[40px]" />
      </section>

      {/* FORMULAIRE */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 border border-gray-100 flex flex-col md:flex-row gap-12">
          {/* Coordonnées */}
          <div className="md:w-1/3 space-y-6">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Nos coordonnées</h2>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Vous pouvez nous écrire via le formulaire ou utiliser directement les informations ci-dessous :
            </p>
            <div className="flex items-center gap-3 text-gray-700 hover:text-blue-700 transition">
              <FiMail className="w-6 h-6 text-blue-600" aria-label="email" />
              <span>contact@epropulse.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 hover:text-blue-700 transition">
              <FiPhone className="w-6 h-6 text-blue-600" aria-label="phone" />
              <span>+229 01 50 50 52 92</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 hover:text-blue-700 transition">
              <FiMapPin className="w-6 h-6 text-blue-600" aria-label="location" />
              <span>Cotonou, Bénin</span>
            </div>
            <div className="mt-8 text-sm text-gray-500 italic">
              Disponible du <strong>lundi au samedi</strong> de 8h à 19h
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:w-2/3 space-y-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Envoyez-nous un message</h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-blue-50/40 p-8 rounded-2xl border border-blue-100 backdrop-blur-sm"
              noValidate
            >
              {/* Champ invisible anti-bot */}
              <input
                type="text"
                name="honey"
                value={formData.honey}
                onChange={handleChange}
                className="hidden"
                autoComplete="off"
              />

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-blue-800 mb-1">
                  Nom complet *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={80}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom et prénom"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-800 mb-1">
                  Adresse email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-blue-800 mb-1">
                  Votre message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  minLength={5}
                  maxLength={2000}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Écrivez votre message ici..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? 'Envoi en cours...' : <>
                  <FiSend className="w-5 h-5" />
                  <span>Envoyer le message</span>
                </>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
