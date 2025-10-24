// Homepage.tsx
import { motion } from "framer-motion"; // Removed unused imports: AnimatePresence, useState, useEffect, useRef
import { useLanguage } from "./LanguageContext";
import styles from './Homepage.module.css';
import NeuralConnections from './background/interactive-network-small/interactive-network-small';

// Removed unused icon imports

export function Homepage() {
  const { t } = useLanguage();

  // Removed all state, refs, effects, data, and functions related to pillars

  // Removed unused animation variants

  return (
    <main className={`${styles.homepageWrapper} relative`}>
      {/* Background Animation */}
      <NeuralConnections />

      {/* Vision Section Content */}
      <section className={`${styles.visionSection} relative z-10`}>
        <motion.div
          className={styles.visionContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          // Ensure exit prop is removed if not using AnimatePresence wrapper
          transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] as const }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className={styles.visionSubtitle}>{t('homepage.leadership.subtitle')}</h3>
          <h1 className={styles.visionTitle}>{t('homepage.leadership.title')}</h1>
          <p className={styles.visionDescription}>
            {t('homepage.leadership.description')}
          </p>
        </motion.div>
      </section>

      {/* Ecosystem Section has been completely removed */}

      {/* Add any other sections of your homepage here if needed */}

    </main>
  );
}