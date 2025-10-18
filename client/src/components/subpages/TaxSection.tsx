// src/components/subpages/TaxSection.tsx

import { useLanguage } from '../LanguageContext';
import styles from './TaxSection.module.css';
import { ShieldCheck, Users, Landmark, Building2, Search, SlidersHorizontal, UserCheck, Network, FolderSearch } from 'lucide-react';
import { motion } from "framer-motion";
import { InteractiveWavesBackground } from '../background/interactive-waves/interactive-waves';
import React, { useState, useEffect } from 'react';

const taxData = {
  focus: [
    { icon: ShieldCheck, titleKey: 'tax.focus.item1.title', descKey: 'tax.focus.item1.description' },
    { icon: Users, titleKey: 'tax.focus.item2.title', descKey: 'tax.focus.item2.description' },
    { icon: Landmark, titleKey: 'tax.focus.item3.title', descKey: 'tax.focus.item3.description' },
  ],
  approach: [
    { icon: Building2, titleKey: 'tax.approach.item1.title', descKey: 'tax.approach.item1.description' },
    { icon: Search, titleKey: 'tax.approach.item2.title', descKey: 'tax.approach.item2.description' },
    { icon: SlidersHorizontal, titleKey: 'tax.approach.item3.title', descKey: 'tax.approach.item3.description' },
  ],
  delivery: [
    { icon: UserCheck, titleKey: 'tax.delivery.item1.title', descKey: 'tax.delivery.item1.description' },
    { icon: Network, titleKey: 'tax.delivery.item2.title', descKey: 'tax.delivery.item2.description' },
    { icon: FolderSearch, titleKey: 'tax.delivery.item3.title', descKey: 'tax.delivery.item3.description' },
  ],
} as const;

// --- ANIMATION VARIANTS (No changes here) ---

const headerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: "easeInOut" } 
  }
} as const;

const gridContainerVariants = {
  hidden: { opacity: 1 }, // Stays at 1 so container itself isn't faded
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
} as const;

const gridItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
} as const;


export function TaxSection() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // --- [THE FIX] ---
  // Instead of replacing the props with {}, we now conditionally set the 'initial' state.
  // On mobile, the initial state IS the visible state, so no animation runs.
  // On desktop, the initial state is 'hidden', so it animates into view.
  const animationProps = {
      initial: isMobile ? "visible" : "hidden",
      whileInView: "visible",
      viewport: { once: true }
  };
  
  // The grid items inherit the initial/whileInView from their parent container,
  // so we only need to provide the variants.
  const gridItemProps = { variants: gridItemVariants };
  // --- [END FIX] ---

  const gridItems = [];
  const numRows = Math.max(taxData.focus.length, taxData.approach.length, taxData.delivery.length);

  // Add headers first
  gridItems.push(
    <motion.h2
      key="header-focus" 
      className={styles.columnHeader} 
      {...gridItemProps}
      style={{ '--col': 1 } as React.CSSProperties}
    >
      {t('tax.focusTitle')}
    </motion.h2>,
    <motion.h2
      key="header-approach" 
      className={styles.columnHeader} 
      {...gridItemProps}
      style={{ '--col': 2 } as React.CSSProperties}
    >
      {t('tax.approachTitle')}
    </motion.h2>,
    <motion.h2
      key="header-delivery" 
      className={styles.columnHeader} 
      {...gridItemProps}
      style={{ '--col': 3 } as React.CSSProperties}
    >
      {t('tax.deliveryTitle')}
    </motion.h2>
  );

  // Add content items row by row
  for (let i = 0; i < numRows; i++) {
    const row = [taxData.focus[i], taxData.approach[i], taxData.delivery[i]];
    row.forEach((item, colIndex) => {
      const styleProps = { 
        '--col': colIndex + 1, 
        '--row': i + 1 
      } as React.CSSProperties;

      if (item) {
        gridItems.push(
          <motion.div
            key={`${i}-${colIndex}`} 
            className={styles.gridItem}
            {...gridItemProps}
            style={styleProps}
          >
            <div className={styles.itemHeader}>
              <item.icon className={styles.icon} />
              <h3 className={styles.itemTitle}>{t(item.titleKey)}</h3>
            </div>
            <p className={styles.itemText}>{t(item.descKey)}</p>
          </motion.div>
        );
      } else {
        gridItems.push(
          <motion.div
            key={`placeholder-${i}-${colIndex}`} 
            {...gridItemProps} 
            style={styleProps}
          />
        );
      }
    });
  }

  return (
    <InteractiveWavesBackground>
      <section className={styles.taxSection}>
        <motion.header
          className={styles.header}
          variants={headerVariants}
          {...animationProps}
        >
          <p className={styles.preTitle}>{t('tax.preTitle')}</p>
          <h1 className={styles.title}>{t('tax.title')}</h1>
          <p className={styles.subtitle}>{t('tax.subtitle')}</p>
        </motion.header>

        <motion.div
          className={styles.contentGrid}
          variants={gridContainerVariants}
          {...animationProps}
        >
          {gridItems}
        </motion.div>
      </section>
    </InteractiveWavesBackground>
  );
}
