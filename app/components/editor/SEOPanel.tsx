'use client';

import { memo } from 'react';

interface SEOStats {
  words: number;
  readingTime: number;
  h1: number;
  h2: number;
  h3: number;
  links: number;
  images: number;
  videos: number;
}

interface SEOPanelProps {
  stats: SEOStats;
}

const SEOPanel = memo(({ stats }: SEOPanelProps) => {
  const indicators = [
    {
      label: 'Mots',
      value: stats.words,
      status: stats.words >= 300 ? 'good' : stats.words >= 150 ? 'warning' : 'bad',
      message: stats.words >= 300 ? '✅ Optimal' : stats.words >= 150 ? '⚠️ Moyen' : '❌ Trop court'
    },
    {
      label: 'Lecture',
      value: `${stats.readingTime} min`,
      status: 'neutral'
    },
    {
      label: 'H1',
      value: stats.h1,
      status: stats.h1 === 1 ? 'good' : 'bad',
      message: stats.h1 === 1 ? '✅ Parfait' : stats.h1 > 1 ? '❌ Trop de H1' : '❌ 1 H1 requis'
    },
    {
      label: 'H2',
      value: stats.h2,
      status: stats.h2 >= 2 ? 'good' : 'warning',
      message: stats.h2 >= 2 ? '✅ Structure bonne' : '⚠️ Ajoutez des H2'
    },
    {
      label: 'Images',
      value: stats.images,
      status: 'neutral'
    },
    {
      label: 'Liens',
      value: stats.links,
      status: stats.links >= 1 ? 'good' : 'warning',
      message: stats.links >= 1 ? '✅ Liens présents' : '⚠️ Ajoutez des liens'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b text-sm">
      {indicators.map((indicator) => (
        <div key={indicator.label} className="text-center">
          <div className="font-semibold text-gray-900">{indicator.value}</div>
          <div className="text-xs text-gray-600">{indicator.label}</div>
          {indicator.message && (
            <div className={`text-xs font-medium ${
              indicator.status === 'good' ? 'text-green-600' :
              indicator.status === 'warning' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {indicator.message}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

SEOPanel.displayName = 'SEOPanel';

export default SEOPanel;