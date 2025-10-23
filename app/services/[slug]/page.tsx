// app/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getServiceBySlug, services, categories } from '../data/services';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Tag, 
  Zap, 
  Palette, 
  Brain, 
  TrendingUp, 
  BarChart3,
  Phone,
  ShieldCheck,
  Sparkles,
  Rocket,
  Target,
  Globe,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  // ⚡ Résoudre la promesse des params
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: 'Service IA non trouvé - Epropulse',
      description: 'Service IA introuvable. Découvrez nos solutions d\'intelligence artificielle disponibles mondialement.',
      robots: 'noindex, nofollow'
    };
  }

  const categoryName = categories.find(c => c.id === service.category)?.name || 'IA';
  const priceInfo = service.price ? `À partir de ${service.price.startingFrom.toLocaleString('fr-FR')} ${service.price.currency}` : 'Devis personnalisé';
  
  // Meta description concise et optimisée
  const metaDescription = `${service.description} ${priceInfo}. Service ${categoryName} disponible dans tous les pays francophones. Livraison ${service.deliveryTime}.`;

  const francophoneKeywords = [
    'IA',
    'intelligence artificielle',
    service.category,
    ...(service.tags || []),
    'solution IA',
    'transformation digitale',
    'services IA France',
    'IA Canada',
    'IA Belgique',
    'IA Suisse',
    'IA Afrique francophone'
  ];

  return {
    title: `${service.title} | Service ${categoryName} International - Epropulse IA`,
    description: metaDescription,
    keywords: francophoneKeywords.join(', '),
    authors: [{ name: 'Epropulse Team' }],
    openGraph: {
      title: `${service.title} - Epropulse Solutions IA International`,
      description: metaDescription,
      type: 'article',
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      url: `https://epropulse.com/services/${service.slug}`,
      siteName: 'Epropulse - Solutions IA International',
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: `Service ${service.title} - Epropulse IA International`,
        },
      ],
      locale: 'fr_FR',
      locales: ['fr_FR', 'fr_CA', 'fr_BE', 'fr_CH', 'fr_LU'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} - Epropulse IA 🌍`,
      description: metaDescription,
      images: [service.image],
      creator: '@epropulse',
    },
    alternates: {
      canonical: `https://epropulse.com/services/${service.slug}`,
      languages: {
        'fr-FR': `https://epropulse.com/fr/services/${service.slug}`,
        'fr-CA': `https://epropulse.com/fr-ca/services/${service.slug}`,
        'fr-BE': `https://epropulse.com/fr-be/services/${service.slug}`,
        'fr-CH': `https://epropulse.com/fr-ch/services/${service.slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

function FAQSchema({ service }: { service: any }) {
  const faqItems = [
    {
      question: `Dans quels pays le service ${service.title} est-il disponible ?`,
      answer: 'Nos services IA sont disponibles dans tous les pays francophones. Service 100% en ligne avec support multilingue.'
    },
    {
      question: `Quel est le délai de livraison pour ${service.title} ?`,
      answer: service.deliveryTime || 'Livraison numérique rapide adaptée à votre projet.'
    }
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqItems.map((item, index) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const ServiceDetailPage = async ({ params }: Props) => {
  // ⚡ Résoudre la promesse des params
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'création': 'bg-blue-100 text-blue-800 border border-blue-200',
      'automatisation': 'bg-purple-100 text-purple-800 border border-purple-200',
      'consulting': 'bg-green-100 text-green-800 border border-green-200',
      'marketing': 'bg-orange-100 text-orange-800 border border-orange-200',
      'data': 'bg-indigo-100 text-indigo-800 border border-indigo-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'création': Palette,
      'automatisation': Zap,
      'consulting': Brain,
      'marketing': TrendingUp,
      'data': BarChart3
    };
    return icons[category as keyof typeof icons] || Sparkles;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const CategoryIcon = getCategoryIcon(service.category);
  const categoryName = categories.find(c => c.id === service.category)?.name;

  return (
    <div className="min-h-screen">
      <FAQSchema service={service} />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Fil d'Ariane" className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft size={14} aria-hidden="true" />
              Accueil
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/services" className="hover:text-blue-600 transition-colors">Services IA</Link>
            <span aria-hidden="true">/</span>
            <span className="text-gray-900 font-medium truncate" aria-current="page">{service.title}</span>
          </nav>
        </div>
      </header>

      {/* Service Detail */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="brounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Hero Section avec Next.js Image */}
          <div className="relative h-80 lg:h-96">
            <Image 
              src={service.image} 
              alt={`Service ${service.title} - Solutions IA International Epropulse disponible mondialement`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
           
            <div className="absolute bottom-6 left-8 right-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getCategoryBadgeColor(service.category)}`}>
                      <CategoryIcon size={16} className="mr-2" aria-hidden="true" />
                      {categoryName}
                    </span>
                    {service.deliveryTime && (
                      <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white border border-white/30">
                        <Clock size={14} className="mr-1" aria-hidden="true" />
                        {service.deliveryTime}
                      </span>
                    )}
                  </div>
                 
                  {/* H1 - Titre principal */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                    {service.title}
                  </h1>
                  <p className="text-xl text-blue-100 leading-relaxed max-w-3xl">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 p-6 lg:p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* H2 - Description détaillée */}
              <section className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-500 rounded-full" aria-hidden="true"></div>
                  <span>Description du Service</span>
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {service.detailedDescription}
                </p>
              </section>

              {/* H2 - Fonctionnalités */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-green-500 rounded-full" aria-hidden="true"></div>
                  <span>Fonctionnalités Incluses</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                        <CheckCircle size={14} className="text-green-600" aria-hidden="true" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* H2 - Questions Fréquentes */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-orange-500 rounded-full" aria-hidden="true"></div>
                  <span>Questions Fréquentes</span>
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      question: `Dans quels pays le service ${service.title} est-il disponible ?`,
                      answer: 'Nos services IA sont disponibles dans tous les pays francophones. Service 100% en ligne avec support multilingue.'
                    },
                    {
                      question: `Quel est le délai de livraison pour ${service.title} ?`,
                      answer: service.deliveryTime || 'Livraison numérique rapide adaptée à votre projet.'
                    },
                    {
                      question: `Le service inclut-il un support international ?`,
                      answer: 'Oui, support multilingue 24h/24. Notre équipe est répartie sur différents fuseaux horaires.'
                    }
                  ].map((item, index) => (
                    <details key={index} className="bg-gray-50 rounded-lg border border-gray-200 group">
                      {/* H3 - Questions FAQ */}
                      <summary className="p-4 cursor-pointer font-semibold text-gray-900 list-none flex items-center justify-between">
                        <span>{item.question}</span>
                        <div className="transform group-open:rotate-180 transition-transform">
                          <ArrowLeft size={16} className="text-gray-500" aria-hidden="true" />
                        </div>
                      </summary>
                      <div className="p-4 pt-0 text-gray-700 border-t border-gray-200">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Rocket size={24} className="text-blue-200" aria-hidden="true" />
                    {/* H3 - Call to Action */}
                    <h3 className="text-xl font-bold">
                      Prêt à propulser votre business ?
                    </h3>
                  </div>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Discutons de votre projet et créons une solution sur mesure.
                  </p>
                  
                  <div className="space-y-3">
                    <Link 
                      href={`/services/${service.slug}/commandes?service=${service.slug}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl gap-2"
                    >
                      <Phone size={20} aria-hidden="true" />
                      Demander un devis
                    </Link>
                    
                    <Link 
                      href="/services"
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 gap-2"
                    >
                      <ArrowLeft size={20} aria-hidden="true" />
                      Autres services
                    </Link>
                  </div>
                </div>

                {/* Service Info Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={20} className="text-blue-600" aria-hidden="true" />
                    {/* H3 - Informations */}
                    <h3 className="font-bold text-gray-900">Informations du service</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                        <Tag size={14} aria-hidden="true" />
                        Catégorie
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getCategoryBadgeColor(service.category)}`}>
                          <CategoryIcon size={14} className="mr-2" aria-hidden="true" />
                          {categoryName}
                        </span>
                      </div>
                    </div>

                    {service.deliveryTime && (
                      <div>
                        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                          <Clock size={14} aria-hidden="true" />
                          Délai de livraison
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          {service.deliveryTime}
                        </div>
                      </div>
                    )}

                    {service.price && (
                      <div>
                        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                          <TrendingUp size={14} aria-hidden="true" />
                          Investissement
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(service.price.startingFrom)} {service.price.currency}
                          {service.price.unit && (
                            <span className="text-sm font-normal text-gray-500 ml-1">{service.price.unit}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guarantee Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ShieldCheck size={20} className="text-green-600" aria-hidden="true" />
                    </div>
                    <div>
                      {/* H4 - Garantie */}
                      <h4 className="font-bold text-gray-900">Garantie Satisfait ou Remboursé</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        30 jours pour tester le service
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ServiceDetailPage;