// app/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServiceBySlug, services } from '../data/services';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: 'Service non trouvé',
    };
  }

  return {
    title: `${service.title} | Solutions IA`,
    description: service.description,
  };
}

const ServiceDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      création: 'bg-blue-100 text-blue-800',
      marketing: 'bg-green-100 text-green-800',
      productivité: 'bg-purple-100 text-purple-800',
      support: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryName = (category: string) => {
    const names = {
      création: 'Création de Contenu',
      marketing: 'Marketing Automatisé',
      productivité: 'Productivité',
      support: 'Support Client'
    };
    return names[category as keyof typeof names] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{service.title}</span>
          </nav>
        </div>
      </header>

      {/* Service Detail */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Image */}
          <div className="h-96 relative">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-8 right-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadgeColor(service.category)} mb-4`}>
                    {getCategoryName(service.category)}
                  </span>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {service.title}
                  </h1>
                  <p className="text-xl text-blue-100">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-8 p-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Description détaillée
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {service.detailedDescription}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Fonctionnalités principales
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Intéressé par ce service ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Contactez-nous pour une démonstration personnalisée et un devis adapté à vos besoins.
                </p>
                
                <div className="space-y-4">
                  <Link 
                    href={`/services/${service.slug}/commandes?service=${service.slug}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Demander un devis
                  </Link>
                  
                  <Link 
                    href="/services"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    ← Retour aux services
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Catégorie
                  </h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(service.category)}`}>
                    {getCategoryName(service.category)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetailPage;