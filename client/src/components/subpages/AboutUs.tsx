import SEO from '../SEO'; // Make sure the path is correct
import { useLanguage } from '../LanguageContext'; // Make sure the path is correct
import { AboutUsSection } from './AboutUsSection';

export function AboutUs() {
  const { t } = useLanguage();

  return (
    <div>
      <SEO
        title={t('seo.aboutus.title')}
        description={t('seo.aboutus.description')}
      />
      <main>
        <AboutUsSection /> {/* Render the AboutUsSection component here */}
      </main>
    </div>
  );
}

