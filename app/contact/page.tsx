'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
} from 'react-icons/fi';

export default function ContactPage() {
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('messagepro').insert([
        {
          name: formData.name,
          email: formData.email,
          content: formData.message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Erreur lors de l’envoi :', err);
      alert("❌ Une erreur est survenue. Réessayez plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Message de succès
  if (isSent) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-green-50 to-white px-4">
        <div className="bg-white border border-green-200 shadow-xl rounded-3xl p-10 text-center animate-fade-in max-w-md">
          <FiCheckCircle className="text-green-600 text-6xl mb-3 mx-auto" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Message envoyé avec succès !
          </h2>
          <p className="text-green-600">
            Merci pour votre message 💬<br />Nous vous répondrons très bientôt.
          </p>
          <button
            onClick={() => setIsSent(false)}
            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  // 🦸 Section principale
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* HERO */}
      <section className="relative flex flex-col items-center text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <h1 className="text-5xl font-extrabold mb-3">  <h1 className="text-5xl font-extrabold mb-3"> </h1></h1> <h1 className="text-5xl font-extrabold mb-3">Contactez-nous</h1>
        <p className="text-blue-100 text-lg max-w-xl">
          Une idée, un projet ou une question ? Parlons-en ensemble 
        </p>
        <div className="absolute bottom-0 w-full h-16 bg-white rounded-t-[40px]" />
      </section>

      {/* CONTENU */}
      <section className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 border border-gray-100 flex flex-col md:flex-row gap-10">
          {/* Infos */}
          <div className="md:w-1/3 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nos coordonnées
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Vous pouvez nous écrire via le formulaire ou directement avec les
              informations ci-dessous :
            </p>

            <div className="flex items-center gap-3 text-gray-700">
              <FiMail className="w-6 h-6 text-blue-600" />
              <span>propulser@gmail.com</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FiPhone className="w-6 h-6 text-blue-600" />
              <span>+229 01 50 50 52 92</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FiMapPin className="w-6 h-6 text-blue-600" />
              <span>Cotonou, Bénin</span>
            </div>

            <div className="mt-8 text-sm text-gray-500">
               Disponible du <strong>lundi au samedi</strong> de 8h à 19h
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:w-2/3 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom et prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Écrivez votre message ici..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}
