// src/components/Faq.tsx

import React from 'react';
import SEO from '../seo/SEO'; // Adjust path if necessary based on your folder structure
import { useLanguage } from '../LanguageContext'; // Adjust path if necessary
import { FaqSection } from './FaqSection';

export function Faq() {
  const { t } = useLanguage();

  return (
    <div>
      <SEO
        title={t('seo.faq.title')}
        description={t('seo.faq.description')}
      />
      <main>
        <FaqSection />
      </main>
    </div>
  );
}