// Homepage.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { useState, useEffect, useRef } from "react";
import styles from './Homepage.module.css';
import NeuralConnections from './background/interactive-network-small/interactive-network-small';

// Import your custom icons
import shieldIcon from './assets/icons/shield_icon.png';
import globeIcon from './assets/icons/globe_icon.png';
import brainIcon from './assets/icons/arrow_2.png';

export function Homepage() {
  const { t } = useLanguage();
  
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const pillarIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const ecosystemPillars = [
    { icon: shieldIcon, title: t('interactive.block1-title'), description: t('interactive.block1-description') },
    { icon: globeIcon, title: t('interactive.block2-title'), description: t('interactive.block2-description') },
    { icon: brainIcon, title: t('interactive.block3-title'), description: t('interactive.block3-description') }
  ];

  const startPillarRotation = () => {
    if (pillarIntervalRef.current) clearInterval(pillarIntervalRef.current);
    pillarIntervalRef.current = setInterval(() => {
      setActivePillarIndex(prevIndex => (prevIndex + 1) % ecosystemPillars.length);
    }, 6000);
  };

  useEffect(() => {
    startPillarRotation();
    return () => {
      if (pillarIntervalRef.current) clearInterval(pillarIntervalRef.current);
    };
  }, []); // Note: useEffect dependency array is empty, which is correct for this use case.

  const handlePillarClick = (index: number) => {
    setActivePillarIndex(index);
    startPillarRotation();
  };
  
  const activePillar = ecosystemPillars[activePillarIndex];

  const ecosystemContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const ecosystemItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  return (
    <main className={styles.homepageWrapper}>
      <NeuralConnections>
        <section className={styles.visionSection}>
          <motion.div
            className={styles.visionContent}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] as const }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h3 className={styles.visionSubtitle}>{t('homepage.leadership.subtitle')}</h3>
            <h1 className={styles.visionTitle}>{t('homepage.leadership.title')}</h1>
            <p className={styles.visionDescription}>
              {t('homepage.leadership.description')}
            </p>
          </motion.div>
        </section>
      </NeuralConnections>

      {/* This section is still in your code but not rendered due to the missing map function. 
          If you want to display it, you would map over the `ecosystemPillars` here. */}
      {/* <section className={styles.ecosystemSection}>
        ...
      </section>
      */}
      
    </main>
  );
}