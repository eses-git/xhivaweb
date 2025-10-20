// src/components/subpages/TaxSection.tsx

import { useLanguage } from '../LanguageContext';
import styles from './TaxSection.module.css';
import { ShieldCheck, Users, Landmark, Building2, Search, SlidersHorizontal, UserCheck, Network, FolderSearch } from 'lucide-react';
import { motion } from "framer-motion";
import { InteractiveWavesBackground } from '../background/interactive-waves/interactive-waves';
import React, { useState, useEffect, useRef } from 'react';

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

// --- ANIMATION VARIANTS ---

const headerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: "easeInOut" } 
  }
} as const;

// For staggering children on desktop
const gridContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
} as const;

// FOR DESKTOP: Standard entrance animation
const gridItemDesktopVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
} as const;

// MOBILE SCROLL VARIANTS (CARDS)
const gridItemMobileVariants = {
  outOfView: {
    opacity: 1, // Ensure visibility
    '--grid-item-bg': 'rgba(255, 255, 255, 0.524)',
    '--grid-item-title-color': '#343a40',
    '--grid-item-text-color': '#495057',
    '--grid-item-icon-color': '#D7C286',
  },
  inView: {
    opacity: 1, // Ensure visibility
    '--grid-item-bg': '#90b4d4c2',
    '--grid-item-title-color': '#FFFFFF',
    '--grid-item-text-color': '#FFFFFF',
    '--grid-item-icon-color': '#FFFFFF',
  }
};

// MOBILE SCROLL VARIANTS (COLUMN HEADERS)
const columnHeaderMobileVariants = {
  outOfView: {
    opacity: 1, // Ensure visibility
    '--column-header-color': 'var(--dark-blue)',
  },
  inView: {
    opacity: 1, // Ensure visibility
    '--column-header-color': '#90b4d4c2',
  }
};

export function TaxSection() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const ratiosRef = useRef<Map<string, number>>(new Map());

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

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = Array.from(cardRefs.current.entries()).find(
            ([_, el]) => el === entry.target
          )?.[0];
          if (key) {
            ratiosRef.current.set(key, entry.intersectionRatio);
          }
        });

        // Find the max ratio after updates
        let maxRatio = 0;
        let maxKey: string | null = null;
        ratiosRef.current.forEach((ratio, key) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxKey = key;
          }
        });

        // Only highlight if maxRatio > 0 (at least partially visible)
        setActiveCard(maxRatio > 0 ? maxKey : null);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  // Props for the main <header>
  const headerProps = {
      variants: headerVariants,
      initial: isMobile ? "visible" : "hidden",
      whileInView: "visible",
      viewport: { once: true }
  };

  // Props for the main .contentGrid container
  const gridContainerProps = isMobile 
    ? {} 
    : {
        variants: gridContainerVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.1 }
      };
  
  // Props for the Column Headers (h2)
  const columnHeaderAnimProps = isMobile
    ? {
        variants: columnHeaderMobileVariants,
        initial: "outOfView",
        whileInView: "inView",
        viewport: { amount: 0.5, once: false } // Re-triggers on every scroll in/out
      }
    : {
        variants: gridItemDesktopVariants
      };
  
  const gridItems = [];
  const numRows = Math.max(taxData.focus.length, taxData.approach.length, taxData.delivery.length);

  // Add headers first
  gridItems.push(
    <motion.h2
      key="header-focus" 
      className={styles.columnHeader} 
      {...columnHeaderAnimProps}
      style={{ '--col': 1 } as React.CSSProperties}
    >
      {t('tax.focusTitle')}
    </motion.h2>,
    <motion.h2
      key="header-approach" 
      className={styles.columnHeader} 
      {...columnHeaderAnimProps}
      style={{ '--col': 2 } as React.CSSProperties}
    >
      {t('tax.approachTitle')}
    </motion.h2>,
    <motion.h2
      key="header-delivery" 
      className={styles.columnHeader} 
      {...columnHeaderAnimProps}
      style={{ '--col': 3 } as React.CSSProperties}
    >
      {t('tax.deliveryTitle')}
    </motion.h2>
  );

  // Add content items row by row
  for (let i = 0; i < numRows; i++) {
    const row = [taxData.focus[i], taxData.approach[i], taxData.delivery[i]];
    row.forEach((item, colIndex) => {
      const key = `${i}-${colIndex}`;
      const styleProps = { 
        '--col': colIndex + 1, 
        '--row': i + 1 
      } as React.CSSProperties;

      const gridItemAnimProps = isMobile
        ? {
            variants: gridItemMobileVariants,
            animate: activeCard === key ? "inView" : "outOfView",
          }
        : {
            variants: gridItemDesktopVariants,
          };

      if (item) {
        gridItems.push(
          <motion.div
            key={key} 
            className={styles.gridItem}
            ref={(el) => { cardRefs.current.set(key, el); }} // Wrapped to return void
            {...gridItemAnimProps}
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
            {...gridItemAnimProps}
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
          {...headerProps}
        >
          <p className={styles.preTitle}>{t('tax.preTitle')}</p>
          <h1 className={styles.title}>{t('tax.title')}</h1>
          <p className={styles.subtitle}>{t('tax.subtitle')}</p>
        </motion.header>

        <motion.div
          className={styles.contentGrid}
          {...gridContainerProps}
        >
          {gridItems}
        </motion.div>
      </section>
    </InteractiveWavesBackground>
  );
}