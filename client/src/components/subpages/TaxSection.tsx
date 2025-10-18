// src/components/subpages/TaxSection.tsx

import { useLanguage } from '../LanguageContext';
import styles from './TaxSection.module.css';
import { ShieldCheck, Users, Landmark, Building2, Search, SlidersHorizontal, UserCheck, Network, FolderSearch } from 'lucide-react';
import { motion } from "framer-motion";
import { InteractiveWavesBackground } from '../background/interactive-waves/interactive-waves';

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

// Variant for the header block
const headerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: "easeInOut" } 
  }
} as const;

// Variant for the grid container (to stagger its children)
const gridContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
} as const;

// Variant for each individual grid item (headers and content blocks)
const gridItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
} as const;

// --- END VARIANTS ---


export function TaxSection() {
  const { t } = useLanguage();

  const gridItems = [];
  const numRows = Math.max(taxData.focus.length, taxData.approach.length, taxData.delivery.length);

  // Add headers first, wrapped in motion.h2
  gridItems.push(
    <motion.h2 
      key="header-focus" 
      className={styles.columnHeader} 
      variants={gridItemVariants}
      // UPDATED: Pass column number to CSS
      style={{ '--col': 1 } as React.CSSProperties}
    >
      {t('tax.focusTitle')}
    </motion.h2>,
    <motion.h2 
      key="header-approach" 
      className={styles.columnHeader} 
      variants={gridItemVariants}
      // UPDATED: Pass column number to CSS
      style={{ '--col': 2 } as React.CSSProperties}
    >
      {t('tax.approachTitle')}
    </motion.h2>,
    <motion.h2 
      key="header-delivery" 
      className={styles.columnHeader} 
      variants={gridItemVariants}
      // UPDATED: Pass column number to CSS
      style={{ '--col': 3 } as React.CSSProperties}
    >
      {t('tax.deliveryTitle')}
    </motion.h2>
  );

  // Add content items row by row, wrapped in motion.div
  for (let i = 0; i < numRows; i++) {
    const row = [taxData.focus[i], taxData.approach[i], taxData.delivery[i]];
    row.forEach((item, colIndex) => {
      // UPDATED: Define CSS variables (colIndex is 0-based, so add 1)
      const styleProps = { 
        '--col': colIndex + 1, 
        '--row': i + 1 
      } as React.CSSProperties;

      if (item) {
        gridItems.push(
          <motion.div 
            key={`${i}-${colIndex}`} 
            className={styles.gridItem}
            variants={gridItemVariants}
            // UPDATED: Pass column and row numbers to CSS
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
        // Add a placeholder if a column is shorter
        gridItems.push(
          <motion.div 
            key={`placeholder-${i}-${colIndex}`} 
            variants={gridItemVariants} 
            // UPDATED: Placeholders also need an order
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
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }} 
        >
          <p className={styles.preTitle}>{t('tax.preTitle')}</p>
          <h1 className={styles.title}>{t('tax.title')}</h1>
          <p className={styles.subtitle}>{t('tax.subtitle')}</p>
        </motion.header>

        <motion.div 
          className={styles.contentGrid}
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
        >
          {gridItems}
        </motion.div>
      </section>
    </InteractiveWavesBackground>
  );
}