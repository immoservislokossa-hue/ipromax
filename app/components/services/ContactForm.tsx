'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { services } from '@/app/services/data/services';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  MessageCircle,
  Zap,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

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
  const supabase = createClient();
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

  // Pré-remplissage automatique quand le service change
  useEffect(() => {
    if (serviceParam) {
      const selectedService = services.find(s => s.slug === serviceParam);
      if (selectedService) {
        setFormData(prev => ({
          ...prev,
          service: serviceParam,
          budget_min: selectedService.price?.startingFrom?.toString() || '',
          message: getPredefinedMessage(serviceParam)
        }));
      }
    }
  }, [serviceParam]);

  const getPredefinedMessage = (serviceSlug: string) => {
    const messages: Record<string, string> = {
      'photoshooting-ia': "Bonjour, je suis intéressé(e) par votre service de photoshooting IA professionnel. Pouvez-vous me fournir plus d'informations sur le processus et les options disponibles ?",
      'musique-ia': "Bonjour, je souhaiterais en savoir plus sur votre service de création musicale IA. Quel est le processus de création et quelles sont les options de personnalisation ?",
      'videos-ia': "Bonjour, votre service de vidéos promotionnelles IA m'intéresse. Pourriez-vous me détailler les différentes options et le délai de réalisation ?",
      'design-ia': "Bonjour, je recherche une solution de design graphique IA pour mon projet. Quel est le processus de collaboration et quels formats proposez-vous ?",
      'redaction-livre-ia': "Bonjour, je suis intéressé(e) par votre service de rédaction assistée par IA. Pouvez-vous m'expliquer le processus et les droits d'auteur ?",
      'chatbot-whatsapp': "Bonjour, je souhaite automatiser mes conversations WhatsApp. Quel est le processus d'implémentation et quelles sont les fonctionnalités incluses ?",
      'chatbot-site-web': "Bonjour, j'aimerais ajouter un chatbot IA à mon site web. Pouvez-vous me détailler les options d'intégration et de personnalisation ?",
      'automatisation-marketing': "Bonjour, je cherche à automatiser mes campagnes marketing. Quel est le processus de mise en place et quels canaux pouvez-vous gérer ?",
      'assistant-virtuel': "Bonjour, je souhaite déployer un assistant virtuel pour mon entreprise. Quelles tâches pouvez-vous automatiser et quel est le délai de mise en œuvre ?",
      'scraping-ia': "Bonjour, j'ai besoin d'extraire des données web automatiquement. Quelles sont les limitations et la fréquence de mise à jour possible ?",
      'audit-ia': "Bonjour, je souhaite réaliser un audit IA de mon entreprise. Quel est le processus et quelles recommandations fournissez-vous ?",
      'formation-ia': "Bonjour, je recherche une formation IA pour mon équipe. Quel est le programme et quels sont les prérequis nécessaires ?",
      'diagnostic-ia': "Bonjour, j'aimerais un diagnostic des opportunités IA dans mon activité. Comment se déroule l'analyse et quels livrables fournissez-vous ?",
      'strategie-ia': "Bonjour, je veux élaborer une stratégie de transformation IA. Quel est votre approche et quel accompagnement proposez-vous ?",
      'campagnes-pubs-ia': "Bonjour, je souhaite optimiser mes campagnes publicitaires avec l'IA. Quelles plateformes gérez-vous et quel ROI puis-je attendre ?",
      'seo-ia': "Bonjour, je recherche une solution SEO avancée. Quel est votre processus d'optimisation et quels sont les délais de résultats ?",
      'funnel-conversion-ia': "Bonjour, je veux créer des funnel de conversion automatisés. Quels outils utilisez-vous et quel est le processus de création ?",
      'social-media-automation': "Bonjour, je cherche à automatiser mes réseaux sociaux. Quelles plateformes gérez-vous et quelle est la fréquence de publication ?",
      'analyse-donnees-ia': "Bonjour, j'ai besoin d'analyser mes données business. Quels types d'analyse proposez-vous et quels insights puis-je obtenir ?",
      'predictions-ia': "Bonjour, je souhaite implémenter des modèles prédictifs. Sur quelles données travaillez-vous et quelle est la précision des prédictions ?",
      'bi-ia': "Bonjour, je recherche une plateforme BI intelligente. Quelles sources de données pouvez-vous connecter et quels types de dashboard proposez-vous ?",
    };
    
    return messages[serviceSlug] || "Bonjour, je suis intéressé(e) par vos services IA. Pouvez-vous me contacter pour discuter de mes besoins spécifiques ?";
  };

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
            message: formData.message,
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
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Confirmation visuelle
  if (isSubmitted) {
    const selectedService = services.find(s => s.slug === formData.service);
    
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Demande envoyée avec succès !
        </h3>
        <p className="text-green-700 mb-4">
          Nous vous contacterons très prochainement à propos du service{' '}
          <strong>{selectedService?.title || formData.service}</strong>.
        </p>
        <div className="text-sm text-green-600 space-y-1">
          <p className="flex items-center justify-center gap-2">
            <MessageCircle size={16} />
            Préférence de contact : {formData.contact_preference}
          </p>
          <p className="flex items-center justify-center gap-2">
            <Zap size={16} />
            Urgence : {formData.urgency}
          </p>
        </div>
      </div>
    );
  }

  const selectedService = services.find(s => s.slug === formData.service);

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-xl p-8">
      {/* En-tête */}
      <header className="text-center mb-8">
            <p className="text-gray-500">
          3 étapes simples pour obtenir votre devis personnalisé
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
            <p className="text-xs mt-2 text-gray-500">
              {s === 1 && 'Contact'}
              {s === 2 && 'Budget'}
              {s === 3 && 'Projet'}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étape 1 - Informations personnelles */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <User size={20} />
              Informations personnelles
            </h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  placeholder="Votre nom et prénom"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email *
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone *
              </label>
              <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Pensez à ajouter le code de votre pays (ex : +33, +229, +1...)
              </div>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Étape 2 - Budget & Délai */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <DollarSign size={20} />
              Budget & Délai
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget_min" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget minimum (FCFA) *
                </label>
                <div className="relative">
                  <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="budget_min"
                    type="number"
                    name="budget_min"
                    placeholder="Ex: 50000"
                    value={formData.budget_min}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                {selectedService?.price && (
                  <p className="text-xs text-gray-500 mt-1">
                    À partir de {selectedService.price.startingFrom.toLocaleString()} FCFA
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="budget_max" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget maximum (FCFA)
                </label>
                <div className="relative">
                  <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="budget_max"
                    type="number"
                    name="budget_max"
                    placeholder="Ex: 150000"
                    value={formData.budget_max}
                    onChange={handleChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Date limite souhaitée *
              </label>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {selectedService?.deliveryTime && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock size={14} />
                  Délai de livraison standard : {selectedService.deliveryTime}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_preference" className="block text-sm font-medium text-gray-700 mb-2">
                  Préférence de contact *
                </label>
                <select
                  id="contact_preference"
                  name="contact_preference"
                  value={formData.contact_preference}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="any">WhatsApp ou Email</option>
                  <option value="whatsapp">WhatsApp uniquement</option>
                  <option value="email">Email uniquement</option>
                  <option value="phone">Appel téléphonique</option>
                </select>
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'urgence *
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="low">Peu urgent</option>
                  <option value="medium">Standard</option>
                  <option value="high">Urgent</option>
                  <option value="urgent">Très urgent</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3 - Détails du projet */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <Target size={20} />
              Détails de votre projet
            </h3>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Service souhaité *
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sélectionnez un service</option>
                <optgroup label="Création IA">
                  {services.filter(s => s.category === 'création').map(service => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Automatisation">
                  {services.filter(s => s.category === 'automatisation').map(service => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Consulting & Formation">
                  {services.filter(s => s.category === 'consulting').map(service => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Marketing IA">
                  {services.filter(s => s.category === 'marketing').map(service => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Data & Analytics">
                  {services.filter(s => s.category === 'data').map(service => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Détails de votre projet *
              </label>
              <div className="relative">
                <MessageCircle size={20} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Décrivez votre projet, vos objectifs, vos attentes spécifiques..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Boutons navigation */}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 ml-auto"
            >
              Étape suivante
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Clock size={16} className="animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Envoyer ma demande
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}


