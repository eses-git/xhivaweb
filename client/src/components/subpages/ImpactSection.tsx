// src/components/ImpactSection.tsx

import React, { useState, useEffect, useRef } from 'react'; // --- Added useRef
import { useLanguage } from '../LanguageContext';
import styles from './ImpactSection.module.css';
import { Landmark, HeartHandshake } from 'lucide-react';
import { AnimatedBackgroundWrapper } from '../background/isometric-background/AnimatedBackgroundWrapperGold';

export function ImpactSection() {
  const { t } = useLanguage();
  const [activePillar, setActivePillar] = useState<'economic' | 'humanitarian'>('economic');
  
  // --- FIX: Create a ref to hold the interval ID ---
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- FIX: Create a function to start/reset the timer ---
  const startTimer = () => {
    // Clear the old timer if it exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Start a new timer and save its ID
    intervalRef.current = setInterval(() => {
      setActivePillar(currentPillar =>
        currentPillar === 'economic' ? 'humanitarian' : 'economic'
      );
    }, 6000);
  };

  useEffect(() => {
    // --- FIX: Start the timer on component mount ---
    startTimer();

    // --- FIX: Update cleanup function to use the ref ---
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array is correct, runs only on mount/unmount

  const pillars = {
    economic: {
      id: 'economic',
      icon: <Landmark />,
      titleKey: 'impact.economic.title',
      descriptionKey: 'impact.economic.description',
    },
    humanitarian: {
      id: 'humanitarian',
      icon: <HeartHandshake />,
      titleKey: 'impact.humanitarian.title',
      descriptionKey: 'impact.humanitarian.description',
    }
  };
  
  // --- FIX: Create a click handler to set pillar and reset timer ---
  const handlePillarChange = (pillar: 'economic' | 'humanitarian') => {
    setActivePillar(pillar);
    startTimer(); // Reset the timer on click
  };

  return (
   <AnimatedBackgroundWrapper className={styles.section}>
      <section>
        <header className={styles.header}>
          <p className={styles.preTitle}>{t('impact.preTitle')}</p>
          <h1 className={styles.title}>{t('impact.title')}</h1>
          <p className={styles.introText}>{t('impact.intro1')}</p>
        </header>

        <div className={styles.pillarToggles}>
          {Object.values(pillars).map(pillar => (
            <button
              key={pillar.id}
              className={`${styles.toggleButton} ${activePillar === pillar.id ? styles.active : ''}`}
              // --- FIX: Use the new handler function ---
              onClick={() => handlePillarChange(pillar.id as 'economic' | 'humanitarian')}
            >
              {t(pillar.titleKey as any)}
            </button>
          ))}
        </div>

        {/* --- MOBILE CARD CONTAINER --- */}
        <div className={styles.cardContainerForMobile}>
          {Object.values(pillars).map(pillar => (
            <div
              key={pillar.id}
              className={`${styles.mobileCardContent} ${activePillar === pillar.id ? styles.active : ''}`}
            >
              <div className={styles.icon}>{pillar.icon}</div>
              <h3 className={styles.pillarTitle}>{t(pillar.titleKey as any)}</h3>
              <p className={styles.pillarDescription}>{t(pillar.descriptionKey as any)}</p>
            </div>
          ))}
        </div>

        {/* --- 3D FLIPPER FOR DESKTOP --- */}
        <div className={styles.perspectiveContainer}>
          <div className={`${styles.flipperCard} ${activePillar === 'humanitarian' ? styles.isFlipped : ''}`}>
            {/* Front Face */}
            <div className={`${styles.cardFace} ${styles.cardFaceFront}`}>
              <div className={styles.cardContent}>
                <div className={styles.icon}>{pillars.economic.icon}</div>
                <h3 className={styles.pillarTitle}>{t(pillars.economic.titleKey as any)}</h3>
                <p className={styles.pillarDescription}>{t(pillars.economic.descriptionKey as any)}</p>
              </div>
            </div>
            {/* Back Face */}
            <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
              <div className={styles.cardContent}>
                <div className={styles.icon}>{pillars.humanitarian.icon}</div>
                <h3 className={styles.pillarTitle}>{t(pillars.humanitarian.titleKey as any)}</h3>
                <p className={styles.pillarDescription}>{t(pillars.humanitarian.descriptionKey as any)}</p>
              </div>
            </div>
          </div>
        </div>

        <p className={styles.conclusionText}>
          {t('impact.conclusion')}
        </p>
      </section>
   </AnimatedBackgroundWrapper>
  );
}