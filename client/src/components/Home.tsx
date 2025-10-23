// Home.tsx
import React, { useEffect, useState, Suspense, lazy } from 'react'; // Import Suspense and lazy
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { Hero } from "./Hero"; // Keep Hero imported normally
// Remove direct imports for components below the fold
// import { AboutSection } from "./AboutSection";
// import { StrategySection } from "./StrategySection";
 import { Homepage } from "./Homepage";
// import { CallToActionSection } from "./CallToActionSection";
// import { Footer } from "./Footer";
// import { DisclaimerModal } from "./DisclaimerModal"; // REMOVED DisclaimerModal import
import styles from "./AboutSection.module.css"; // Keep styles if needed by Home itself
import SEO from './seo/SEO';

// Lazy load components that are below the fold
const AboutSection = lazy(() => import('./AboutSection').then(module => ({ default: module.AboutSection })));
const StrategySection = lazy(() => import('./StrategySection').then(module => ({ default: module.StrategySection })));
//const Homepage = lazy(() => import('./Homepage').then(module => ({ default: module.Homepage })));
const CallToActionSection = lazy(() => import('./CallToActionSection').then(module => ({ default: module.CallToActionSection })));
const Footer = lazy(() => import('./Footer').then(module => ({ default: module.Footer })));

// (Optional) Define a simple loading indicator component
const LoadingFallback = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh', // Adjust height as needed
        fontSize: '1.2rem',
        color: '#666'
    }}>
        Loading Section...
    </div>
);

export const Home = () => {
  const location = useLocation();
  // REMOVED useState for isDisclaimerOpen
  // const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // REMOVED checkDisclaimer function and call

    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // Use setTimeout to allow lazy components time to load before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 500); // Adjust delay if needed
      }
    } else {
        // Scroll to top on initial load or navigation without hash
        window.scrollTo(0, 0);
    }

  }, [location]); // Rerun effect if location changes (e.g., hash change)

  return (
    <div className="min-h-screen">
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        keywords={t('seo.home.keywords')}
      />

      <Hero /> {/* Hero renders immediately */}

      {/* Bridge Section - Keep outside Suspense if it's typically visible early */}
      <motion.section
        className={styles.bridgeSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
        id="about" // Ensure this ID matches links if used for navigation
        style={{ marginTop: '2rem', paddingTop: '6rem' }} // Review styling consistency
      >
        <motion.div
          className={styles.bridgeLine}
          initial={{ width: 0 }}
          whileInView={{ width: '80px' }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        />
        <motion.p
          className={styles.bridgeText}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          {t('home.bridgeText')}
        </motion.p>
      </motion.section>

      {/* Wrap all lazy-loaded components in a single Suspense */}
      <Suspense fallback={<LoadingFallback />}>
        <AboutSection />
        <StrategySection />
        <Homepage />
        <CallToActionSection />
        <Footer />
      </Suspense>

      {/* REMOVED DisclaimerModal component instance */}
      {/*
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
      */}
    </div>
  );
};