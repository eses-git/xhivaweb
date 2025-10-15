// src/components/subpages/Services.tsx

import SEO from '../seo/SEO';
import { useLanguage } from '../LanguageContext';
import { ServicesSection } from './ServicesSection';

export function Services() {
  const { t } = useLanguage();

  return (
    <div>
      <SEO
        title={t('seo.services.title')}
        description={t('seo.services.description')}
      />
      <main>
        <ServicesSection /> {/* Render the ServicesSection component here */}
      </main>
    </div>
  );
}