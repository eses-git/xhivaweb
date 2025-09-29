// src/components/StrategiesSection.tsx

import { motion, Variants } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import styles from './StrategiesSection.module.css';
import { Fingerprint, Scale, Target, Search, Eye, DraftingCompass, ShieldCheck } from "lucide-react";

// Framer Motion variants for animations
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut",
      staggerChildren: 0.1
    } 
  }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function StrategiesSection() {
  const { t } = useLanguage();

  // A single, unified array for all strategy cards
  const strategies = [
    { section: 'approach', icon: <Fingerprint />, titleKey: 'strategy.approach.item1.title', descriptionKey: 'strategy.approach.item1.description' },
    { section: 'approach', icon: <Scale />, titleKey: 'strategy.approach.item2.title', descriptionKey: 'strategy.approach.item2.description' },
    { section: 'approach', icon: <Target />, titleKey: 'strategy.approach.item3.title', descriptionKey: 'strategy.approach.item3.description' },
    { section: 'governance', icon: <Search />, titleKey: 'strategy.governance.item1.title', descriptionKey: 'strategy.governance.item1.description' },
    { section: 'governance', icon: <Eye />, titleKey: 'strategy.governance.item2.title', descriptionKey: 'strategy.governance.item2.description' },
    { section: 'governance', icon: <DraftingCompass />, titleKey: 'strategy.governance.item3.title', descriptionKey: 'strategy.governance.item3.description' },
    { section: 'governance', icon: <ShieldCheck />, titleKey: 'strategy.governance.item4.title', descriptionKey: 'strategy.governance.item4.description' },
  ];

  return (
    <div className={styles.strategyPage}>
      
      {/* --- Hero Section --- */}
      <motion.header 
        className={styles.hero}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <motion.p variants={itemVariants} className={styles.preTitle}>{t('strategy.page.preTitle')}</motion.p>
        <motion.h1 variants={itemVariants} className={styles.title}>{t('strategy.page.title')}</motion.h1>
        <motion.h2 variants={itemVariants} className={styles.subtitle}>{t('strategy.page.subtitle')}</motion.h2>
        <motion.p variants={itemVariants} className={styles.introText}>{t('strategy.page.intro')}</motion.p>
        <motion.p variants={itemVariants} className={styles.disclaimerText}>{t('strategy.page.disclaimer')}</motion.p>
      </motion.header>

      <main>
        {/* --- All Strategies Section --- */}
        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <motion.h3 variants={itemVariants} className={styles.sectionHeader}>{t('strategy.approach.title')}</motion.h3>
          <motion.p variants={itemVariants} className={styles.sectionIntro}>{t('strategy.approach.intro')}</motion.p>
          
          <div className={styles.grid}>
            {strategies.filter(s => s.section === 'approach').map((item, index) => (
              <motion.div key={index} className={styles.strategyCardWrapper} variants={itemVariants}>
                <div className={styles.strategyCard}>
                  <div className={styles.cardIcon}>{item.icon}</div>
                  <h4 className={styles.cardTitle}>{t(item.titleKey as any)}</h4>
                  <div className={styles.cardOverlay}></div>
                  <p className={styles.cardDescription}>{t(item.descriptionKey as any)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.h3 variants={itemVariants} className={styles.sectionHeader} style={{ marginTop: '6rem' }}>{t('strategy.governance.title')}</motion.h3>
          <motion.p variants={itemVariants} className={styles.sectionIntro}>{t('strategy.governance.intro')}</motion.p>

           <div className={styles.grid}>
            {strategies.filter(s => s.section === 'governance').map((item, index) => (
              <motion.div key={index} className={styles.strategyCardWrapper} variants={itemVariants}>
                <div className={styles.strategyCard}>
                  <div className={styles.cardIcon}>{item.icon}</div>
                  <h4 className={styles.cardTitle}>{t(item.descriptionKey as any)}</h4>
                  <div className={styles.cardOverlay}></div>
                  <p className={styles.cardDescription}>{t(item.descriptionKey as any)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* --- Concluding Section --- */}
        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
           <p className={styles.conclusionText}>{t('strategy.conclusion.text')}</p>
        </motion.section>
      </main>

    </div>
  );
}