// src/components/Home.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext"; // 1. Import the hook
import { Hero } from "./Hero";
import { AboutSection } from "./AboutSection";
import { StrategySection } from "./StrategySection";
import { Homepage } from "./Homepage";
import { CallToActionSection } from "./CallToActionSection";
import { Footer } from "./Footer";
import { DisclaimerModal } from "./DisclaimerModal";
import styles from "./AboutSection.module.css";

export const Home = () => {
  const location = useLocation();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const { t } = useLanguage(); // 2. Initialize the translation function

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);
      const element = document.getElementById(targetId);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Hero />

      <motion.section 
        className={styles.bridgeSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
        id="about"
        style={{ marginTop: '2rem', paddingTop: '6rem' }}
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
          {/* 3. Use the t() function for the text */}
          {t('home.bridgeText')} 
        </motion.p>
      </motion.section>
      
      <AboutSection />
      <StrategySection />
      <Homepage />
      <CallToActionSection />
      <Footer />
      <DisclaimerModal 
        isOpen={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
      />
    </div>
  );
};