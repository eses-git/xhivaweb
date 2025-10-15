import SEO from '../seo/SEO';
import { useLanguage } from '../LanguageContext';
import { FundsSection } from './FundsSection'; // Assuming FundsSection.tsx is in the same folder

export function Funds() {
  const { t } = useLanguage();

  return (
    <div>
      <SEO
        title={t('seo.funds.title')}
        description={t('seo.funds.description')}
      />
      <main>
        <FundsSection /> {/* Render the FundsSection component here */}
      </main>
    </div>
  );
}
