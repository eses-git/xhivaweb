// src/components/AboutUsSection.tsx

import React, { useState, ComponentType, Suspense, lazy } from 'react'; // Import Suspense and lazy
import styles from './AboutUs.module.css';
import { useLanguage } from '../LanguageContext';

// --- IMPORT THE ICONS ---
import { DueDiligenceIcon } from '../icons/DueDiligenceIcon';
import { TransparencyIcon } from '../icons/TransparencyIcon';
import { ComplianceIcon } from '../icons/ComplianceIcon';

// --- LAZY LOAD THE BACKGROUND COMPONENT ---
// This tells React to load this component's code only when it's first needed.
const InteractiveConnectionsBackgroundLight = lazy(() =>
  import('../background/interactive-connections-background-light/interactive-connections-background-light')
    // Ensure you are exporting the component correctly
    .then(module => ({ default: module.InteractiveConnectionsBackgroundLight }))
);

type Principle = {
  id: number;
  title: string;
  text: string;
  IconComponent: ComponentType;
};

export function AboutUsSection() {
  const { t } = useLanguage();
  const [activePanelId, setActivePanelId] = useState<number>(1);

  const principles: Principle[] = [
    { id: 1, title: t('about.principles.item1.title'), text: t('about.principles.item1.text'), IconComponent: DueDiligenceIcon },
    { id: 2, title: t('about.principles.item2.title'), text: t('about.principles.item2.text'), IconComponent: TransparencyIcon },
    { id: 3, title: t('about.principles.item3.title'), text: t('about.principles.item3.text'), IconComponent: ComplianceIcon },
  ];

  // --- FALLBACK UI ---
  // Define what to show while the background component is loading.
  // Keep it simple and lightweight.
  const backgroundLoadingFallback = (
    <div style={{
      minHeight: '100vh', // Ensure it takes up space
      backgroundColor: '#f8f9fa', // A light placeholder background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6c757d'
    }}>
      Loading Interactive Background...
    </div>
  );

  return (
    // Wrap the lazy-loaded component in Suspense
    <Suspense fallback={backgroundLoadingFallback}>
      {/* InteractiveConnectionsBackgroundLight will only be rendered after its code is loaded */}
      <InteractiveConnectionsBackgroundLight>
        {/* The rest of your AboutUs content remains the same */}
        <div className={styles.container}>

          <header className={styles.header}>
            <p className={styles.preTitle}>{t('about.page.preTitle')}</p>
            <h1 className={styles.mainTitle}>{t('about.page.mainTitle')}</h1>
          </header>

          {/* --- Two Pillars Layout --- */}
          <div className={styles.preludeContainer}>
            <div className={styles.preludeColumn}>
              <h3>
                {t('about.page.title')}
              </h3>
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
                // Add keydown handler for accessibility if needed (e.g., Enter/Space to activate)
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivePanelId(principle.id); }}
              >
                <div className={styles.panelHeader}>
                  <div className={styles.panelIcon}>
                    <principle.IconComponent />
                  </div>
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
      </InteractiveConnectionsBackgroundLight>
    </Suspense>
  );
}