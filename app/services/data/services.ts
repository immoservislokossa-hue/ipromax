// app/services/data/services.ts
export interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  detailedDescription: string;
  features: string[];
  image: string;
  category: 'création' | 'marketing' | 'productivité' | 'support';
}

export const services: Service[] = [
  // 🎨 CRÉATION IA
  {
    id: 1,
    slug: "photoshooting-ia",
    title: "Photoshooting IA",
    description: "Images photoréalistes générées par IA pour avatars et shooting virtuels",
    detailedDescription: "Obtenez des visuels professionnels sans contraintes logistiques. Notre IA crée des images photoréalistes pour votre branding, produits ou équipe avec un contrôle total sur les styles, poses et arrière-plans.",
    features: [
      "Avatars réalistes et personnalisables",
      "Shooting virtuel sans déplacement",
      "Styles variés : corporate, créatif, lifestyle",
      "Modifications infinies incluses",
      "Résolution 4K optimisée web et print"
    ],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1528&q=80",
    category: 'création'
  },
  {
    id: 2,
    slug: "musique-ia",
    title: "Création de Musique IA Personnalisée",
    description: "Compositions musicales uniques adaptées à votre projet",
    detailedDescription: "Donnez une identité sonore à votre marque avec des compositions originales générées par IA. Parfait pour vos publicités, podcasts, contenus vidéo ou ambiance d'entreprise.",
    features: [
      "Compositions 100% originales et libres de droits",
      "Adaptation à votre branding et ambiance",
      "Formats professionnels : MP3, WAV, STEMS",
      "Révisions illimitées jusqu'à satisfaction",
      "Mastering audio professionnel inclus"
    ],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'création'
  },
  {
    id: 3,
    slug: "videos-ia",
    title: "Vidéos Promotionnelles IA",
    description: "Vidéos engageantes avec voix off et avatars IA réalistes",
    detailedDescription: "Transformez vos messages en expériences vidéo captivantes. Notre IA génère des vidéos professionnelles avec voice-over naturel et présentateurs virtuels pour booster vos conversions.",
    features: [
      "Scénarisation et storyboard automatisés",
      "Avatars IA réalistes ou animation personnalisée",
      "Voice-over naturel dans 50+ langues",
      "Sound design et musique sur mesure",
      "Optimisation pour tous les réseaux sociaux"
    ],
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'création'
  },
 
  {
    id: 5,
    slug: "redaction-livre-ia",
    title: "Rédaction de Livre IA",
    description: "Écriture assistée par IA pour vos projets littéraires et contenus longs",
    detailedDescription: "Donnez vie à vos idées avec notre assistant d'écriture IA. Que ce soit pour un livre, un guide ou des contenus longs, notre IA vous accompagne de l'idée à la publication.",
    features: [
      "Assistance à l'écriture et structuration",
      "Style adapté à votre ton et public",
      "Recherche et documentation automatisée",
      "Correction et optimisation stylistique",
      "Formats d'export multiples"
    ],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'création'
  },

  // 🤖 PRODUCTIVITÉ (AUTOMATISATION)
  {
    id: 6,
    slug: "chatbot-whatsapp",
    title: "Chatbot WhatsApp Intelligent",
    description: "Automatisez vos conversations clients 24h/24 avec l'IA",
    detailedDescription: "Ne ratez plus aucune opportunité ! Notre chatbot WhatsApp IA gère vos conversations, qualifie vos leads et répond aux questions fréquentes même pendant votre sommeil.",
    features: [
      "Réponses contextuelles et personnalisées",
      "Qualification automatique des leads",
      "Disponible 24h/24, 7j/7",
      "Analytics détaillés et reporting",
      "Intégration CRM et outils existants"
    ],
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    category: 'productivité'
  },
  {
    id: 7,
    slug: "chatbot-site-web",
    title: "Chatbot Site Web IA",
    description: "Assistant virtuel intelligent pour votre site web",
    detailedDescription: "Améliorez l'expérience utilisateur et convertissez plus de visiteurs avec notre chatbot site web. Qualification des leads, support client et guidance automatique.",
    features: [
      "Lead qualification et scoring",
      "Support client automatisé",
      "Guidage personnalisé des visiteurs",
      "Intégration avec vos bases de connaissances",
      "Analytics comportementaux détaillés"
    ],
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'productivité'
  },
  {
    id: 8,
    slug: "automatisation-marketing",
    title: "Automatisation Marketing",
    description: "Systèmes marketing autonomes pour emails, CRM et funnels",
    detailedDescription: "Libérez-vous des tâches répétitives ! Nous créons des systèmes marketing autonomes : emails séquencés, segmentation avancée, lead nurturing et conversion automatique.",
    features: [
      "Séquences emails personnalisées IA",
      "Segmentation comportementale automatique",
      "Multi-canaux : Email, SMS, Push, Social",
      "A/B testing automatisé par IA",
      "Intégration avec vos outils existants"
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'productivité'
  },
  {
    id: 9,
    slug: "assistant-virtuel",
    title: "Assistant Virtuel d'Entreprise",
    description: "IA de gestion pour automatiser vos tâches administratives",
    detailedDescription: "Déléguez la gestion quotidienne à notre assistant IA. Prise de rendez-vous, gestion des emails, organisation des tâches et bien plus encore.",
    features: [
      "Gestion automatique des emails",
      "Planification et calendrier intelligent",
      "Organisation des tâches et projets",
      "Rapports automatiques et synthèses",
      "Intégrations avec vos outils"
    ],
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'productivité'
  },
  {
    id: 10,
    slug: "scraping-ia",
    title: "Scraping IA de Sites Web",
    description: "Extraction intelligente de données web pour votre business",
    detailedDescription: "Transformez le web en votre base de données personnelle. Notre IA extrait, nettoie et organise automatiquement les informations stratégiques : prospects, prix concurrents, tendances marché.",
    features: [
      "Extraction de données structurées et non-structurées",
      "Nettoyage et enrichissement automatique",
      "Export dans votre format préféré",
      "Mise à jour automatique selon planning",
      "Conforme RGPD et législations"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'productivité'
  },

  // 🧠 SUPPORT (CONSULTING & FORMATION)
  {
    id: 11,
    slug: "audit-ia",
    title: "Audit IA Complet d'Entreprise",
    description: "Diagnostic des opportunités IA dans votre business",
    detailedDescription: "Notre équipe d'experts analyse vos processus métier et identifie les points où l'IA peut générer le plus de valeur. Rapport détaillé avec recommandations actionnables.",
    features: [
      "Analyse complète de vos processus métier",
      "Identification des opportunités IA prioritaires",
      "Estimation ROI et plan de mise en œuvre",
      "Recommandations concrètes et actionnables",
      "Roadmap personnalisée sur 6-12 mois"
    ],
    image: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'support'
  },
  {
    id: 12,
    slug: "formation-ia",
    title: "Formation IA pour Équipes",
    description: "Formation pratique aux outils IA les plus performants",
    detailedDescription: "Donnez à votre équipe un avantage compétitif décisif. Formations pratiques et immersives sur les outils IA les plus performants du marché. De la génération de contenu à l'automatisation avancée.",
    features: [
      "Formation pratique 100% opérationnelle",
      "Focus sur les outils IA les plus performants",
      "Supports de formation complets et mises à jour",
      "Certification Propulser IA incluse",
      "Support post-formation 30 jours"
    ],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'support'
  },
  {
    id: 13,
    slug: "diagnostic-ia",
    title: "Diagnostic IA Opportunités",
    description: "Détection des axes d'amélioration par IA dans votre activité",
    detailedDescription: "Identifiez rapidement les leviers IA les plus impactants pour votre business. Analyse rapide et ciblée avec recommandations prioritaires pour une mise en œuvre immédiate.",
    features: [
      "Analyse rapide et ciblée de votre activité",
      "Identification des leviers IA prioritaires",
      "Plan d'action immédiat et concret",
      "Estimation des gains potentiels",
      "Accompagnement mise en œuvre"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'support'
  },
  {
    id: 14,
    slug: "strategie-ia",
    title: "Stratégie Transformation IA",
    description: "Accompagnement sur mesure pour intégrer l'IA dans vos processus",
    detailedDescription: "Déployez l'IA dans votre entreprise de manière structurée et efficace. De la stratégie initiale à l'implémentation complète, nous vous accompagnons à chaque étape.",
    features: [
      "Stratégie d'intégration IA personnalisée",
      "Plan de déploiement étape par étape",
      "Accompagnement à la mise en œuvre",
      "Formation des équipes clés",
      "Suivi et optimisation continue"
    ],
    image: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'support'
  },

  // 📈 MARKETING IA
 
  {
    id: 16,
    slug: "seo-ia",
    title: "SEO IA",
    description: "Optimisation SEO avancée boostée par intelligence artificielle",
    detailedDescription: "Dominez les résultats de recherche avec notre approche SEO IA. Analyse de mots-clés, rédaction optimisée et stratégie de linking intelligente pour un référencement naturel performant.",
    features: [
      "Analyse de mots-clés prédictive",
      "Rédaction de contenu optimisé SEO",
      "Stratégie de linking intelligente",
      "Monitoring concurrentiel automatisé",
      "Reporting performance détaillé"
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'marketing'
  },
 
  {
    id: 18,
    slug: "funnel-conversion-ia",
    title: "Funnel de Conversion IA",
    description: "Systèmes de conversion automatisés avec landing pages et emails IA",
    detailedDescription: "Concevez des funnel de vente qui convertissent automatiquement. De la landing page persuasive aux emails séquencés, notre IA optimise chaque étape du parcours client.",
    features: [
      "Landing pages optimisées par IA",
      "Séquences emails automatisées",
      "Personnalisation en temps réel",
      "Optimisation continue des conversions",
      "Intégration avec vos CRM"
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'marketing'
  },
  {
    id: 19,
    slug: "social-media-automation",
    title: "Social Media Automation IA",
    description: "Gestion automatisée de vos réseaux sociaux par intelligence artificielle",
    detailedDescription: "Maintenez une présence constante sur les réseaux sans effort. Notre IA crée, planifie et publie votre contenu tout en analysant les performances pour optimiser votre stratégie.",
    features: [
      "Création automatique de contenu",
      "Planification intelligente des publications",
      "Analyse de performance en temps réel",
      "Optimisation des heures de publication",
      "Rapports détaillés d'engagement"
    ],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'marketing'
  }
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug);
};

export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'tous') return services;
  return services.filter(service => service.category === category);
};