// src/components/subpages/Partnership.tsx

import SEO from '../SEO';
import { useLanguage } from '../LanguageContext';
import { PartnershipsSection } from './PartnershipsSection';

export function Partnership() {
  const { t } = useLanguage();

  return (
    <div>
      <SEO
        title={t('seo.partnership.title')}
        description={t('seo.partnership.description')}
      />
      <main>
        <PartnershipsSection /> {/* Render the PartnershipsSection component here */}
      </main>
    </div>
  );
}