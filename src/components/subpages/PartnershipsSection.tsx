// src/components/PartnershipsSection.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import styles from './PartnershipsSection.module.css';
import { Link } from "react-router-dom";
import { AnimatedBackgroundWrapper } from '../background/isometric-background/AnimatedBackgroundWrapper';

// ADDED: Interface definitions to fix the TypeScript error
interface PartnershipItem {
  category: string;
  description: string;
  focus: string;
}

interface AccordionItemProps {
  item: PartnershipItem;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <motion.div
      layout
      className={`${styles.partnerItem} ${isOpen ? styles.active : ''}`}
      transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <header className={styles.itemHeader} onClick={onClick}>
        <h3 className={styles.categoryTitle}>{item.category}</h3>
        <div className={styles.icon}></div>
      </header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
            className={styles.contentWrapper}
          >
            <div className={styles.contentInner}>
              <p className={styles.focusText}>{item.focus}</p>
              <p className={styles.categoryDescription}>{item.description}</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function PartnershipsSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const partnerships: PartnershipItem[] = [
    { category: t('partnerships.item1.category'), description: t('partnerships.item1.description'), focus: t('partnerships.item1.focus') },
    { category: t('partnerships.item2.category'), description: t('partnerships.item2.description'), focus: t('partnerships.item2.focus') },
    { category: t('partnerships.item3.category'), description: t('partnerships.item3.description'), focus: t('partnerships.item3.focus') },
    { category: t('partnerships.item4.category'), description: t('partnerships.item4.description'), focus: t('partnerships.item4.focus') },
    { category: t('partnerships.item5.category'), description: t('partnerships.item5.description'), focus: t('partnerships.item5.focus') },
    { category: t('partnerships.item6.category'), description: t('partnerships.item6.description'), focus: t('partnerships.item6.focus') }
  ];

  const handleItemClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <AnimatedBackgroundWrapper>
      <section id="partnerships" className={styles.partnershipsSection}>
        <div className={styles.header}>
          <div className={styles.subtitle}>{t('partnerships.preTitle')}</div>
          <h2 className={styles.title}>{t('partnerships.title')}</h2>
        </div>

        <div className={styles.accordionContainer}>
          {partnerships.map((partner, index) => (
            <AccordionItem
              key={partner.category}
              item={partner}
              isOpen={activeIndex === index}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </div>

        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>{t('partnerships.cta.title')}</h3>
          <p className={styles.ctaSubtitle}>
            {t('partnerships.cta.subtitle')}
          </p>
          <Link to="/#contact" className={styles.ctaButton}>
            <span>{t('partnerships.cta.button')}</span>
          </Link>
        </div>
      </section>
    </AnimatedBackgroundWrapper>
  );
}