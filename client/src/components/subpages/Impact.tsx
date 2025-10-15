import SEO from '../SEO';
import { useLanguage } from '../LanguageContext';
import { ImpactSection } from './ImpactSection';

export function Impact() {
  const { t } = useLanguage();

  return (
    <div>
      <SEO
        title={t('seo.impact.title')}
        description={t('seo.impact.description')}
      />
      <main>
        <ImpactSection /> {/* Render the ImpactSection component here */}
      </main>
    </div>
  );
}
