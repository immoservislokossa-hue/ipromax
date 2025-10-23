export interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  detailedDescription: string;
  features: string[];
  image: string;
  category: 'création' | 'automatisation' | 'consulting' | 'marketing' | 'data';
  price?: {
    startingFrom: number;
    currency: string;
    unit?: string;
  };
  deliveryTime?: string;
  tags?: string[];
}

export const services: Service[] = [
  // 🎨 CRÉATION IA
  {
    id: 1,
    slug: "photoshooting-ia",
    title: "Photoshooting IA Professionnel",
    description: "Images photoréalistes générées par IA pour avatars et shooting virtuels",
    detailedDescription: "Obtenez des visuels professionnels sans contraintes logistiques. Notre IA crée des images photoréalistes pour votre branding, produits ou équipe avec un contrôle total sur les styles, poses et arrière-plans. Idéal pour les entrepreneurs, influenceurs et entreprises cherchant une identité visuelle unique et cohérente.",
    features: [
      "Avatars réalistes et personnalisables",
      "Shooting virtuel sans déplacement",
      "Styles variés : corporate, créatif, lifestyle",
      "Modifications infinies incluses",
      "Résolution 4K optimisée web et print",
      "Plus de 50 styles artistiques disponibles",
      "Arrière-plans contextuels adaptatifs"
    ],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1528&q=80",
    category: 'création',
    price: {
      startingFrom: 25000,
      currency: 'FCFA',
      unit: 'par pack de 10 images'
    },
    deliveryTime: "24-48 heures",
    tags: ["images", "avatar", "branding", "professionnel"]
  },
  {
    id: 2,
    slug: "musique-ia",
    title: "Création de Musique IA Personnalisée",
    description: "Compositions musicales uniques adaptées à votre projet",
    detailedDescription: "Donnez une identité sonore à votre marque avec des compositions originales générées par IA. Parfait pour vos publicités, podcasts, contenus vidéo ou ambiance d'entreprise. Notre système analyse votre branding et crée des compositions sur mesure qui renforcent votre identité auditive.",
    features: [
      "Compositions 100% originales et libres de droits",
      "Adaptation à votre branding et ambiance",
      "Formats professionnels : MP3, WAV, STEMS",
      "Révisions illimitées jusqu'à satisfaction",
      "Mastering audio professionnel inclus",
      "Génération en 15+ genres musicaux",
      "Synchronisation parfaite avec vos vidéos"
    ],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'création',
    price: {
      startingFrom: 45000,
      currency: 'FCFA',
      unit: 'par composition'
    },
    deliveryTime: "48-72 heures",
    tags: ["musique", "audio", "branding", "original"]
  },
  {
    id: 3,
    slug: "videos-ia",
    title: "Vidéos Promotionnelles IA",
    description: "Vidéos engageantes avec voix off et avatars IA réalistes",
    detailedDescription: "Transformez vos messages en expériences vidéo captivantes. Notre IA génère des vidéos professionnelles avec voice-over naturel et présentateurs virtuels pour booster vos conversions. Parfait pour les publicités, formations en ligne et présentations d'entreprise.",
    features: [
      "Scénarisation et storyboard automatisés",
      "Avatars IA réalistes ou animation personnalisée",
      "Voice-over naturel dans 50+ langues",
      "Sound design et musique sur mesure",
      "Optimisation pour tous les réseaux sociaux",
      "Sous-titres automatiques multilingues",
      "Adaptation aux ratios de chaque plateforme"
    ],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1528&q=80",
    category: 'création',
    price: {
      startingFrom: 75000,
      currency: 'FCFA',
      unit: 'par vidéo de 60 secondes'
    },
    deliveryTime: "3-5 jours",
    tags: ["vidéo", "promotion", "avatar", "multilingue"]
  },
  {
    id: 4,
    slug: "design-ia",
    title: "Design Graphique IA",
    description: "Créations graphiques professionnelles générées par intelligence artificielle",
    detailedDescription: "Obtenez des designs percutants pour tous vos supports de communication. Notre IA crée logos, bannières, infographies et maquettes qui captivent votre audience et renforcent votre identité visuelle.",
    features: [
      "Logos et identité visuelle sur mesure",
      "Bannières réseaux sociaux optimisées",
      "Infographies et données visuelles",
      "Maquettes de sites et applications",
      "Chartes graphiques complètes",
      "Adaptation automatique aux formats",
      "Style cohérent sur tous les supports"
    ],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'création',
    price: {
      startingFrom: 35000,
      currency: 'FCFA',
      unit: 'par projet'
    },
    deliveryTime: "24-48 heures",
    tags: ["design", "graphisme", "logo", "identité"]
  },
  {
    id: 5,
    slug: "redaction-livre-ia",
    title: "Rédaction de Livre IA Assistée",
    description: "Écriture assistée par IA pour vos projets littéraires et contenus longs",
    detailedDescription: "Donnez vie à vos idées avec notre assistant d'écriture IA. Que ce soit pour un livre, un guide ou des contenus longs, notre IA vous accompagne de l'idée à la publication avec une qualité éditoriale professionnelle.",
    features: [
      "Assistance à l'écriture et structuration",
      "Style adapté à votre ton et public",
      "Recherche et documentation automatisée",
      "Correction et optimisation stylistique",
      "Formats d'export multiples (PDF, EPUB, Word)",
      "Optimisation pour l'édition et l'impression",
      "Relecture et validation par des experts"
    ],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'création',
    price: {
      startingFrom: 120000,
      currency: 'FCFA',
      unit: 'par livre (jusquà 200 pages)'
    },
    deliveryTime: "7-14 jours",
    tags: ["rédaction", "livre", "contenu", "édition"]
  },

  // 🤖 AUTOMATISATION
  {
    id: 6,
    slug: "chatbot-whatsapp",
    title: "Chatbot WhatsApp Intelligent",
    description: "Automatisez vos conversations clients 24h/24 avec l'IA",
    detailedDescription: "Ne ratez plus aucune opportunité ! Notre chatbot WhatsApp IA gère vos conversations, qualifie vos leads et répond aux questions fréquentes même pendant votre sommeil. Solution parfaite pour le e-commerce, services et support client.",
    features: [
      "Réponses contextuelles et personnalisées",
      "Qualification automatique des leads",
      "Disponible 24h/24, 7j/7",
      "Analytics détaillés et reporting",
      "Intégration CRM et outils existants",
      "Multilingue et adaptation culturelle",
      "Maintenance et mises à jour incluses"
    ],
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    category: 'automatisation',
    price: {
      startingFrom: 150000,
      currency: 'FCFA',
      unit: 'installation + 1 mois'
    },
    deliveryTime: "5-7 jours",
    tags: ["chatbot", "whatsapp", "support", "automation"]
  },
  {
    id: 7,
    slug: "chatbot-site-web",
    title: "Chatbot Site Web IA",
    description: "Assistant virtuel intelligent pour votre site web",
    detailedDescription: "Améliorez l'expérience utilisateur et convertissez plus de visiteurs avec notre chatbot site web. Qualification des leads, support client et guidance automatique pour maximiser vos conversions.",
    features: [
      "Lead qualification et scoring automatique",
      "Support client 24/7 automatisé",
      "Guidage personnalisé des visiteurs",
      "Intégration avec vos bases de connaissances",
      "Analytics comportementaux détaillés",
      "Personnalisation visuelle complète",
      "Export des leads vers votre CRM"
    ],
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'automatisation',
    price: {
      startingFrom: 120000,
      currency: 'FCFA',
      unit: 'installation + configuration'
    },
    deliveryTime: "3-5 jours",
    tags: ["chatbot", "siteweb", "conversion", "support"]
  },
  {
    id: 8,
    slug: "automatisation-marketing",
    title: "Automatisation Marketing IA",
    description: "Systèmes marketing autonomes pour emails, CRM et funnels",
    detailedDescription: "Libérez-vous des tâches répétitives ! Nous créons des systèmes marketing autonomes : emails séquencés, segmentation avancée, lead nurturing et conversion automatique. Augmentez vos revenus sans effort supplémentaire.",
    features: [
      "Séquences emails personnalisées IA",
      "Segmentation comportementale automatique",
      "Multi-canaux : Email, SMS, Push, Social",
      "A/B testing automatisé par IA",
      "Intégration avec vos outils existants",
      "Workflows de nurturing intelligents",
      "Optimisation continue des performances"
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'automatisation',
    price: {
      startingFrom: 200000,
      currency: 'FCFA',
      unit: 'système complet'
    },
    deliveryTime: "7-10 jours",
    tags: ["marketing", "automation", "email", "crm"]
  },
  {
    id: 9,
    slug: "assistant-virtuel",
    title: "Assistant Virtuel d'Entreprise IA",
    description: "IA de gestion pour automatiser vos tâches administratives",
    detailedDescription: "Déléguez la gestion quotidienne à notre assistant IA. Prise de rendez-vous, gestion des emails, organisation des tâches et bien plus encore. Réduisez votre charge administrative de 70%.",
    features: [
      "Gestion automatique des emails et tri",
      "Planification et calendrier intelligent",
      "Organisation des tâches et projets",
      "Rapports automatiques et synthèses",
      "Intégrations avec vos outils",
      "Traitement des documents administratifs",
      "Alertes et rappels intelligents"
    ],
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'automatisation',
    price: {
      startingFrom: 180000,
      currency: 'FCFA',
      unit: 'configuration + 1 mois'
    },
    deliveryTime: "5-8 jours",
    tags: ["assistant", "productivité", "organisation", "gestion"]
  },
  {
    id: 10,
    slug: "scraping-ia",
    title: "Scraping IA de Sites Web",
    description: "Extraction intelligente de données web pour votre business",
    detailedDescription: "Transformez le web en votre base de données personnelle. Notre IA extrait, nettoie et organise automatiquement les informations stratégiques : prospects, prix concurrents, tendances marché. Conforme RGPD et législations.",
    features: [
      "Extraction de données structurées et non-structurées",
      "Nettoyage et enrichissement automatique",
      "Export dans votre format préféré (CSV, JSON, Excel)",
      "Mise à jour automatique selon planning",
      "Conforme RGPD et législations",
      "Surveillance de la concurrence en temps réel",
      "Alertes sur les changements importants"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'automatisation',
    price: {
      startingFrom: 90000,
      currency: 'FCFA',
      unit: 'par projet de scraping'
    },
    deliveryTime: "3-5 jours",
    tags: ["scraping", "data", "concurrents", "veille"]
  },

  // 🧠 CONSULTING & FORMATION
  {
    id: 11,
    slug: "audit-ia",
    title: "Audit IA Complet d'Entreprise",
    description: "Diagnostic des opportunités IA dans votre business",
    detailedDescription: "Notre équipe d'experts analyse vos processus métier et identifie les points où l'IA peut générer le plus de valeur. Rapport détaillé avec recommandations actionnables et estimation ROI précis.",
    features: [
      "Analyse complète de vos processus métier",
      "Identification des opportunités IA prioritaires",
      "Estimation ROI et plan de mise en œuvre",
      "Recommandations concrètes et actionnables",
      "Roadmap personnalisée sur 6-12 mois",
      "Benchmark des solutions IA du marché",
      "Présentation executive aux décideurs"
    ],
    image: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'consulting',
    price: {
      startingFrom: 250000,
      currency: 'FCFA',
      unit: 'audit complet'
    },
    deliveryTime: "10-14 jours",
    tags: ["audit", "consulting", "stratégie", "transformation"]
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
      "Support post-formation 30 jours",
      "Ateliers pratiques et études de cas réels",
      "Adaptation à votre secteur d'activité"
    ],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'consulting',
    price: {
      startingFrom: 180000,
      currency: 'FCFA',
      unit: 'par participant'
    },
    deliveryTime: "Sur mesure",
    tags: ["formation", "équipe", "compétences", "certification"]
  },
  {
    id: 13,
    slug: "diagnostic-ia",
    title: "Diagnostic IA Opportunités Rapide",
    description: "Détection des axes d'amélioration par IA dans votre activité",
    detailedDescription: "Identifiez rapidement les leviers IA les plus impactants pour votre business. Analyse rapide et ciblée avec recommandations prioritaires pour une mise en œuvre immédiate. Parfait pour les PME et startups.",
    features: [
      "Analyse rapide et ciblée de votre activité",
      "Identification des leviers IA prioritaires",
      "Plan d'action immédiat et concret",
      "Estimation des gains potentiels",
      "Accompagnement mise en œuvre",
      "Focus sur les quick-wins",
      "Rapport exécutif synthétique"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'consulting',
    price: {
      startingFrom: 120000,
      currency: 'FCFA',
      unit: 'diagnostic express'
    },
    deliveryTime: "3-5 jours",
    tags: ["diagnostic", "opportunités", "quick-wins", "analyse"]
  },
  {
    id: 14,
    slug: "strategie-ia",
    title: "Stratégie Transformation IA",
    description: "Accompagnement sur mesure pour intégrer l'IA dans vos processus",
    detailedDescription: "Déployez l'IA dans votre entreprise de manière structurée et efficace. De la stratégie initiale à l'implémentation complète, nous vous accompagnons à chaque étape pour garantir le succès de votre transformation digitale.",
    features: [
      "Stratégie d'intégration IA personnalisée",
      "Plan de déploiement étape par étape",
      "Accompagnement à la mise en œuvre",
      "Formation des équipes clés",
      "Suivi et optimisation continue",
      "Gestion du changement et adoption",
      "Mesure d'impact et reporting"
    ],
    image: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'consulting',
    price: {
      startingFrom: 350000,
      currency: 'FCFA',
      unit: 'projet sur 3 mois'
    },
    deliveryTime: "Sur mesure",
    tags: ["stratégie", "transformation", "accompagnement", "déploiement"]
  },

  // 📈 MARKETING IA
  {
    id: 15,
    slug: "campagnes-pubs-ia",
    title: "Campagnes Publicitaires IA",
    description: "Optimisation automatique des campagnes Google Ads et Meta Ads",
    detailedDescription: "Maximisez votre ROI publicitaire avec notre système IA. Création automatique de copies, optimisation des enchères en temps réel et analyse prédictive des performances. Réduisez vos coûts d'acquisition de 30% en moyenne.",
    features: [
      "Création automatique de copies publicitaires",
      "Optimisation des enchères en temps réel",
      "Analyse prédictive des performances",
      "A/B testing automatisé des créatifs",
      "Rapports de performance détaillés",
      "Alertes sur les opportunités manquées",
      "Recommandations budgétaires intelligentes"
    ],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'marketing',
    price: {
      startingFrom: 150000,
      currency: 'FCFA',
      unit: 'par campagne/mois'
    },
    deliveryTime: "5-7 jours",
    tags: ["publicité", "google-ads", "meta-ads", "roi"]
  },
  {
    id: 16,
    slug: "seo-ia",
    title: "SEO IA Avancé",
    description: "Optimisation SEO avancée boostée par intelligence artificielle",
    detailedDescription: "Dominez les résultats de recherche avec notre approche SEO IA. Analyse de mots-clés prédictive, rédaction optimisée et stratégie de linking intelligente pour un référencement naturel performant et durable.",
    features: [
      "Analyse de mots-clés prédictive",
      "Rédaction de contenu optimisé SEO",
      "Stratégie de linking intelligente",
      "Monitoring concurrentiel automatisé",
      "Reporting performance détaillé",
      "Optimisation technique automatique",
      "Alertes sur les changements d'algorithme"
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'marketing',
    price: {
      startingFrom: 120000,
      currency: 'FCFA',
      unit: 'par mois'
    },
    deliveryTime: "7-10 jours",
    tags: ["seo", "référencement", "mots-clés", "contenu"]
  },
  {
    id: 17,
    slug: "funnel-conversion-ia",
    title: "Funnel de Conversion IA",
    description: "Systèmes de conversion automatisés avec landing pages et emails IA",
    detailedDescription: "Concevez des funnel de vente qui convertissent automatiquement. De la landing page persuasive aux emails séquencés, notre IA optimise chaque étape du parcours client pour maximiser vos conversions.",
    features: [
      "Landing pages optimisées par IA",
      "Séquences emails automatisées",
      "Personnalisation en temps réel",
      "Optimisation continue des conversions",
      "Intégration avec vos CRM",
      "Scoring des leads intelligent",
      "Workflows de nurturing adaptatifs"
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'marketing',
    price: {
      startingFrom: 180000,
      currency: 'FCFA',
      unit: 'funnel complet'
    },
    deliveryTime: "10-14 jours",
    tags: ["funnel", "conversion", "landing-page", "email"]
  },
  {
    id: 18,
    slug: "social-media-automation",
    title: "Social Media Automation IA",
    description: "Gestion automatisée de vos réseaux sociaux par intelligence artificielle",
    detailedDescription: "Maintenez une présence constante sur les réseaux sans effort. Notre IA crée, planifie et publie votre contenu tout en analysant les performances pour optimiser votre stratégie. Idéal pour la cohérence de marque et l'engagement continu.",
    features: [
      "Création automatique de contenu",
      "Planification intelligente des publications",
      "Analyse de performance en temps réel",
      "Optimisation des heures de publication",
      "Rapports détaillés d'engagement",
      "Suggestions de contenu basées sur les tendances",
      "Gestion multi-plateformes unifiée"
    ],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: 'marketing',
    price: {
      startingFrom: 100000,
      currency: 'FCFA',
      unit: 'par mois'
    },
    deliveryTime: "5-7 jours",
    tags: ["social-media", "automation", "contenu", "engagement"]
  },

  // 📊 DATA & ANALYTICS
  {
    id: 19,
    slug: "analyse-donnees-ia",
    title: "Analyse de Données IA",
    description: "Exploration et insights automatisés de vos données business",
    detailedDescription: "Transformez vos données en avantage compétitif. Notre IA analyse vos données métier, identifie des patterns cachés et génère des insights actionnables pour prendre des décisions éclairées.",
    features: [
      "Nettoyage et préparation automatique des données",
      "Détection de patterns et corrélations",
      "Visualisations interactives et dashboards",
      "Alertes sur les anomalies et opportunités",
      "Prédictions et modélisations avancées",
      "Reporting automatisé personnalisé",
      "Intégration avec toutes vos sources de données"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'data',
    price: {
      startingFrom: 200000,
      currency: 'FCFA',
      unit: 'projet d\'analyse'
    },
    deliveryTime: "10-15 jours",
    tags: ["analyse", "data", "insights", "dashboard"]
  },
  {
    id: 20,
    slug: "predictions-ia",
    title: "Prédictions Business IA",
    description: "Modèles prédictifs pour anticiper les tendances et performances",
    detailedDescription: "Anticipez l'avenir de votre business avec nos modèles prédictifs IA. Prévisions de ventes, analyse de tendances marché et détection d'opportunités pour une prise de décision proactive.",
    features: [
      "Prévisions de ventes et demande",
      "Analyse de tendances marché",
      "Détection d'opportunités émergentes",
      "Modélisation de scénarios what-if",
      "Alertes précoces sur les risques",
      "Intégration avec vos données historiques",
      "Dashboards prédictifs interactifs"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'data',
    price: {
      startingFrom: 250000,
      currency: 'FCFA',
      unit: 'modèle prédictif'
    },
    deliveryTime: "15-20 jours",
    tags: ["prédiction", "forecasting", "tendances", "analyse"]
  },
  {
    id: 21,
    slug: "bi-ia",
    title: "Business Intelligence IA",
    description: "Plateforme BI intelligente pour la prise de décision data-driven",
    detailedDescription: "Centralisez et analysez toutes vos données business dans une plateforme BI intelligente. Tableaux de bord interactifs, rapports automatisés et insights en temps réel pour toute votre organisation.",
    features: [
      "Tableaux de bord personnalisés et interactifs",
      "Rapports automatisés et programmables",
      "Alertes intelligentes en temps réel",
      "Analyse comparative et benchmarking",
      "Collaboration d'équipe sécurisée",
      "Intégration avec 100+ sources de données",
      "Mobile-friendly et accessibilité totale"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: 'data',
    price: {
      startingFrom: 300000,
      currency: 'FCFA',
      unit: 'implémentation complète'
    },
    deliveryTime: "20-25 jours",
    tags: ["bi", "business-intelligence", "reporting", "dashboard"]
  }
];

export const categories = [
  { id: "tous", name: "Tous les services" },
  { id: "création", name: "Création IA" },
  { id: "automatisation", name: "Automatisation" },
  { id: "consulting", name: "Consulting & Formation" },
  { id: "marketing", name: "Marketing IA" },
  { id: "data", name: "Data & Analytics" }
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug);
};

export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'tous') return services;
  return services.filter(service => service.category === category);
};

export const getFeaturedServices = (): Service[] => {
  return services.filter(service => 
    [1, 6, 11, 15, 19].includes(service.id)
  );
};