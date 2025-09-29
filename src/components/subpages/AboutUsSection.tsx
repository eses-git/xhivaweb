// src/components/AboutUsSection.tsx

import React, { useState } from 'react';
import styles from './AboutUs.module.css';
import { useLanguage } from '../LanguageContext';
import { AnimatedBackgroundWrapper } from '../background/isometric-background/AnimatedBackgroundWrapperGold';

type Principle = {
  id: number;
  title: string;
  text: string;
  icon?: string;
};

export function AboutUsSection() {
  const { t } = useLanguage();
  const [activePanelId, setActivePanelId] = useState<number>(1);

  const principles: Principle[] = [
    { id: 1, title: t('about.principles.item1.title'), text: t('about.principles.item1.text'), icon: 'Icon1' },
    { id: 2, title: t('about.principles.item2.title'), text: t('about.principles.item2.text'), icon: 'Icon2' },
    { id: 3, title: t('about.principles.item3.title'), text: t('about.principles.item3.text'), icon: 'Icon3' },
  ];

  // The AnimatedBackgroundWrapper now IS the main section.
  // The extra <section> tag has been removed.
  return (
    <AnimatedBackgroundWrapper className={styles.aboutUsSection}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <p className={styles.preTitle}>{t('about.page.preTitle')}</p>
          <h1 className={styles.mainTitle}>{t('about.page.mainTitle')}</h1>
        </header>

        {/* --- Two Pillars Layout --- */}
        <div className={styles.preludeContainer}>
          <div className={styles.preludeColumn}>
            <h3>Our Position in Global Finance</h3>
            <p>{t('about.page.intro1')}</p>
            <p>{t('about.page.intro2')}</p>
          </div>
          <div className={styles.preludeColumn}>
            <h3>{t('about.philosophy.title')}</h3>
            <p>{t('about.philosophy.text')}</p>
          </div>
        </div>

        {/* --- Transition Text --- */}
        <div className={styles.transitionText}>
          <p>{t('about.mission.text2')}</p>
        </div>

        {/* --- INTERACTIVE HARMONY PANELS --- */}
        <div className={styles.harmonyContainer}>
          {principles.map((principle) => (
            <div 
              key={principle.id} 
              className={`${styles.harmonyPanel} ${activePanelId === principle.id ? styles.active : ''}`}
              onClick={() => setActivePanelId(principle.id)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.panelHeader}>
                <div className={styles.panelIcon}></div>
                <h3>{principle.title}</h3>
              </div>
              <div className={styles.panelContent}>
                <p>{principle.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- CAPSTONE / MISSION STATEMENT --- */}
        <div className={styles.capstoneSection}>
            <h2>{t('about.mission.title')}</h2>
            <p>{t('about.mission.text1')}</p>
        </div>
        
      </div>
    </AnimatedBackgroundWrapper>
  );
}