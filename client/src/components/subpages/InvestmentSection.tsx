// src/components/InvestmentSection.tsx

import { useState, useEffect } from 'react'; // Import useEffect
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import styles from './InvestmentSection.module.css';

// Framer Motion variants
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } }
};

export function InvestmentSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const programs = [
    { id: 'program1', titleKey: 'investment.program1.title', descriptionKey: 'investment.program1.description', accessKey: 'investment.program1.access', durationKey: 'investment.program1.duration', riskKey: 'investment.program1.risk' },
    { id: 'program2', titleKey: 'investment.program2.title', descriptionKey: 'investment.program2.description', accessKey: 'investment.program2.access', durationKey: 'investment.program2.duration', riskKey: 'investment.program2.risk' },
    { id: 'program3', titleKey: 'investment.program3.title', descriptionKey: 'investment.program3.description', accessKey: 'investment.program3.access', durationKey: 'investment.program3.duration', riskKey: 'investment.program3.risk' },
    { id: 'program4', titleKey: 'investment.program4.title', descriptionKey: 'investment.program4.description', accessKey: 'investment.program4.access', durationKey: 'investment.program4.duration', riskKey: 'investment.program4.risk' },
  ];
  
  const activeProgram = programs[activeIndex];

  // ADDED: useEffect for automatic rotation
  useEffect(() => {
    // Set up an interval to advance the index every 6 seconds
    const intervalId = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % programs.length);
    }, 6000); // 6000 milliseconds = 6 seconds

    // Clean up the interval when the component unmounts or activeIndex changes
    return () => clearInterval(intervalId);
  }, [activeIndex, programs.length]); // Resets the timer on manual click

  return (
    <section className={styles.section}>
      <motion.header 
        className={styles.header}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <p className={styles.preTitle}>{t('investment.preTitle')}</p>
        <h1 className={styles.title}>{t('investment.title')}</h1>
        <p className={styles.introText}>{t('investment.intro1')}</p>
        <p className={styles.introText}>{t('investment.intro2')}</p>
        <p className={styles.ctaText}>{t('investment.cta')}</p>
      </motion.header>

      <div className={styles.mainContent}>
        {/* Left Column: Navigation */}
        <aside className={styles.navigation}>
          <ul>
            {programs.map((program, index) => (
              <li 
                key={program.id} 
                className={`${styles.navItem} ${activeIndex === index ? styles.active : ''}`}
              >
                <button onClick={() => setActiveIndex(index)}>
                  {t(program.titleKey as any)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Column: Dynamic Content Panel */}
        <main className={styles.contentPanel}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex} // Key change triggers the animation
              className={styles.programDetails}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className={styles.programTitle}>{t(activeProgram.titleKey as any)}</h2>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <h4 className={styles.detailTitle}>{t('investment.details.description')}</h4>
                  <p>{t(activeProgram.descriptionKey as any)}</p>
                </div>
                <div className={styles.detailItem}>
                  <h4 className={styles.detailTitle}>{t('investment.details.access')}</h4>
                  <p>{t(activeProgram.accessKey as any)}</p>
                </div>
                <div className={styles.detailItem}>
                  <h4 className={styles.detailTitle}>{t('investment.details.duration')}</h4>
                  <p>{t(activeProgram.durationKey as any)}</p>
                </div>
                <div className={styles.detailItem}>
                  <h4 className={styles.detailTitle}>{t('investment.details.risk')}</h4>
                  <p>{t(activeProgram.riskKey as any)}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </section>
  );
}