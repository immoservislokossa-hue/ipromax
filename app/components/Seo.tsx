// components/SEO.tsx
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  keywords?: string;
  schema?: Record<string, any>;
}

export default function SEO({
  title = 'Epropulse – IA & Digital accessibles à tous',
  description = 'Epropulse aide les créateurs, entrepreneurs et entreprises francophones à utiliser l’IA et le digital pour accélérer leur croissance, même sans compétences techniques.',
  canonical = 'https://www.epropulse.com',
  image = 'https://www.epropulse.com/og-default.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
  keywords,
  schema,
}: SEOProps) {
  const fullTitle = title.includes('Epropulse') ? title : `${title} | Epropulse`;

  return (
    <Head>
      {/* --- Balises de base --- */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || 'IA, digital, formation, automatisation, marketing, Epropulse, Visual Arise'} />
      <meta name="author" content="Epropulse" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />

      {/* --- Open Graph (Facebook / LinkedIn) --- */}
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Epropulse" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* --- Twitter Cards --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@epropulse" />

      {/* --- Données structurées JSON-LD --- */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      )}
    </Head>
  );
}
