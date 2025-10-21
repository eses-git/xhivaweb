// src/components/subpages/CookiePolicy.tsx

import SEO from './seo/SEO';
import { useLanguage } from './LanguageContext';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './LegalPages.module.css'; // We'll create a new CSS module for styling

export function CookiePolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={t('seo.cookiePolicy.title')}
        description={t('seo.cookiePolicy.description')}
      />
      <Header />
      <main className={styles.legalContainer}>
        <div className={styles.legalContent}>
          <h1>{t('cookiePolicy.title')}</h1>
          <p className={styles.effectiveDate}>{t('cookiePolicy.effectiveDate')}</p>

          <section>
            <h2>{t('cookiePolicy.section1.title')}</h2>
            <p>{t('cookiePolicy.section1.p1')}</p>
          </section>

          <section>
            <h2>{t('cookiePolicy.section2.title')}</h2>
            <p>{t('cookiePolicy.section2.p1')}</p>
            <h3>{t('cookiePolicy.section2.sub1.title')}</h3>
            <p>{t('cookiePolicy.section2.sub1.p1')}</p>
            <ul>
              <li><strong>{t('cookiePolicy.section2.sub1.cookie1.name')}:</strong> {t('cookiePolicy.section2.sub1.cookie1.desc')}</li>
              <li><strong>{t('cookiePolicy.section2.sub1.cookie2.name')}:</strong> {t('cookiePolicy.section2.sub1.cookie2.desc')}</li>
            </ul>
           
            <h3>{t('cookiePolicy.section2.sub2.title')}</h3>
            <p>{t('cookiePolicy.section2.sub2.p1')}</p>
            <ul>
               <li><strong>{t('cookiePolicy.section2.sub2.cookie1.name')}:</strong> {t('cookiePolicy.section2.sub2.cookie1.desc')}</li>
            </ul>
          </section>
          <section>
            <h2>{t('cookiePolicy.section3.title')}</h2>
            <p>{t('cookiePolicy.section3.p1')}</p>
          </section>
          
          <section>
            <h2>{t('cookiePolicy.section4.title')}</h2>
            <p>{t('cookiePolicy.section4.p1')}</p>
          </section>

          <section>
            <h2>{t('cookiePolicy.section5.title')}</h2>
            <p>{t('cookiePolicy.section5.p1')}  <a href="/contact" color="#D7C286" >contact@XHIVA.org</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}