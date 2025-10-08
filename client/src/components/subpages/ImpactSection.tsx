// src/components/ImpactSection.tsx

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import styles from './ImpactSection.module.css';
import { Landmark, HeartHandshake } from 'lucide-react';
import { AnimatedBackgroundWrapper } from '../background/isometric-background/AnimatedBackgroundWrapperGold';

export function ImpactSection() {
  const { t } = useLanguage();
  const [activePillar, setActivePillar] = useState<'economic' | 'humanitarian'>('economic');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActivePillar(currentPillar =>
        currentPillar === 'economic' ? 'humanitarian' : 'economic'
      );
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

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

  return (
   <AnimatedBackgroundWrapper className={styles.section}>
      <section>
        <header className={styles.header}>
          <p className={styles.preTitle}>{t('impact.preTitle')}</p>
          <h1 className={styles.title}>{t('impact.title')}</h1>
          <p className={styles.introText}>{t('impact.intro1')}</p>
        </header>

        {/* --- MOBILE CARD CONTAINER (Updated for equal height) --- */}
        <div className={styles.cardContainerForMobile}>
          {/* We render BOTH cards and use CSS to show/hide them */}
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

        <div className={styles.pillarToggles}>
          {Object.values(pillars).map(pillar => (
            <button
              key={pillar.id}
              className={`${styles.toggleButton} ${activePillar === pillar.id ? styles.active : ''}`}
              onClick={() => setActivePillar(pillar.id as 'economic' | 'humanitarian')}
            >
              {t(pillar.titleKey as any)}
            </button>
          ))}
        </div>

        <p className={styles.conclusionText}>
          {t('impact.conclusion')}
        </p>
      </section>
   </AnimatedBackgroundWrapper>
  );
}