'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  budget_min: string;
  budget_max: string;
  deadline: string;
  contact_preference: 'whatsapp' | 'email' | 'phone' | 'any';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

export default function ContactForm() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: serviceParam,
    message: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    contact_preference: 'any',
    urgency: 'medium',
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Messages préremplis selon service
  const predefinedMessages: Record<string, string> = {
    musique: "Bonjour ! Je suis intéressé(e) par votre service de création de musique personnalisée.",
    photoshooting: "Bonjour ! Je souhaite en savoir plus sur votre service de photoshooting IA.",
    video: "Bonjour ! Votre service de vidéo promotionnelle IA m'intéresse beaucoup.",
    livre: "Bonjour ! Je suis intéressé(e) par votre service de rédaction de livre assistée par IA.",
    'design-graphique': "Bonjour ! Votre service de design graphique IA semble parfait pour mes besoins.",
    'chatbot-whatsapp': "Bonjour ! Je veux automatiser mes communications WhatsApp.",
    'automation-marketing': "Bonjour ! Je cherche à automatiser mes campagnes marketing.",
    'chatbot-site': "Bonjour ! J'aimerais implémenter un chatbot intelligent sur mon site web.",
    'assistant-entreprise': "Bonjour ! Je souhaite déployer un assistant IA pour mon entreprise.",
    'analyse-donnees': "Bonjour ! J'ai besoin d'analyser mes données avec l'IA.",
  };

  const initialMessage =
    predefinedMessages[serviceParam] ||
    "Bonjour ! Je suis intéressé(e) par vos services IA. Pouvez-vous me contacter pour discuter de mes besoins ?";

  // Gestion des changements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Navigation étapes
  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.phone)) {
      alert('Merci de remplir vos informations personnelles.');
      return;
    }
    if (step === 2 && (!formData.budget_min || !formData.deadline)) {
      alert('Merci de remplir le budget et la date limite.');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // Envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message || initialMessage,
            budget_min: formData.budget_min ? parseInt(formData.budget_min) : null,
            budget_max: formData.budget_max ? parseInt(formData.budget_max) : null,
            deadline: formData.deadline,
            contact_preference: formData.contact_preference,
            urgency: formData.urgency,
            status: 'new',
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      console.error('Erreur lors de l’envoi :', err);
      alert('❌ Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Confirmation visuelle
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg animate-fade-in">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Demande envoyée avec succès !
        </h3>
        <p className="text-green-700">
          Nous vous contacterons très prochainement à propos du service{' '}
          <strong>{formData.service}</strong>.
        </p>
      </div>
    );
  }

  // 🧩 Formulaire principal
  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-xl p-8 transition-all duration-500">
      {/* En-tête */}
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Commande – {serviceParam || 'Service'}
        </h2>
        <p className="text-gray-500 text-sm">
          3 étapes simples pour obtenir votre devis 💡
        </p>
      </header>

      {/* Barre de progression */}
      <div className="flex justify-between mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                s === step
                  ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg'
                  : s < step
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-400 border-gray-300'
              }`}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étape 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-700">
              👤 Informations personnelles
            </h3>

            <input
              name="name"
              placeholder="Nom complet"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                📞 Pensez à ajouter le code de votre pays (ex : +33, +229, +1...)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Entrez votre numéro WhatsApp"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Étape 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-700">
              💰 Budget & Délai
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="budget_min"
                placeholder="Budget minimum"
                value={formData.budget_min}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="budget_max"
                placeholder="Budget maximum"
                value={formData.budget_max}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                name="contact_preference"
                value={formData.contact_preference}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">WhatsApp ou Email</option>
                <option value="whatsapp">WhatsApp uniquement</option>
                <option value="email">Email uniquement</option>
                <option value="phone">Appel téléphonique</option>
              </select>

              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Peu urgent</option>
                <option value="medium">Standard</option>
                <option value="high">Urgent</option>
                <option value="urgent">Très urgent</option>
              </select>
            </div>
          </div>
        )}

        {/* Étape 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-700">📝 Projet</h3>

            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisissez un service</option>
              <option value="musique">Création de Musique Personnalisée</option>
              <option value="photoshooting">Photoshooting IA</option>
              <option value="video">Vidéo Promotionnelle IA</option>
              <option value="livre">Rédaction de Livre IA</option>
              <option value="design-graphique">Design Graphique IA</option>
              <option value="chatbot-whatsapp">Chatbot WhatsApp</option>
              <option value="automation-marketing">Automatisation Marketing</option>
              <option value="chatbot-site">Chatbot Site Web</option>
              <option value="assistant-entreprise">Assistant Virtuel Entreprise</option>
              <option value="analyse-donnees">Analyse de Données IA</option>
            </select>

            <textarea
              name="message"
              rows={5}
              value={formData.message || initialMessage}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        )}

        {/* Boutons navigation */}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              ⬅ Retour
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Étape suivante →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : '📨 Envoyer'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
