// StrategySection.tsx
import { motion, AnimatePresence, Variants, useReducedMotion } from "framer-motion";
import { BarChart2, ShieldCheck, Globe, Sun, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useState } from "react";
import styles from './StrategySection.module.css';

const imageUrl = '/strategy1.png';

type Strategy = {
  icon: React.ElementType;
  title: string;
  description: string;
  emphasis: string;
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
    },
  },
};

export function StrategySection() {
  const { t } = useLanguage();
  // UPDATED: Changed state to track the active (tapped) card index
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const strategies: Strategy[] = [
    { icon: BarChart2, title: t('strategy.card1.title'), description: t('strategy.card1.description'), emphasis: "" },
    { icon: ShieldCheck, title: t('strategy.card2.title'), description: t('strategy.card2.description'), emphasis: "" },
    { icon: Globe, title: t('strategy.card3.title'), description: t('strategy.card3.description'), emphasis: "" },
    { icon: Sun, title: t('strategy.card4.title'), description: t('strategy.card4.description'), emphasis: "" },
  ];

  return (
    <section id="strategy" className={styles.strategySection}>
      <div className={styles.contentContainer}>
        <motion.div
          className={styles.header}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 30
          }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.subtitle}>{t('strategy.subtitle')}</div>
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: t('strategy.title').replace('<br></br>', '<br/>') }} />
          <p className={styles.description}>{t('strategy.description')}</p>
        </motion.div>
      </div>

      <div className={styles.gridWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.layoutContainer}>
            <motion.div
              className={styles.strategyGrid}
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {strategies.map((strategy, index) => {
                const isActive = activeIndex === index;
                return (
                  <motion.div
                    key={strategy.title}
                    // UPDATED: Using .isActive class now
                    className={`${styles.strategyCard} ${isActive ? styles.isActive : ''}`}
                    // UPDATED: Changed from hover events to a tap event
                    onTap={() => setActiveIndex(isActive ? null : index)}
                    layout
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    variants={cardVariants}
                    initial={shouldReduceMotion ? "visible" : "hidden"}
                    whileInView="visible"
                  >
                    <ArrowUpRight className={styles.cardIndicatorIcon} />

                    <motion.div layout="position" className={styles.cardHeader}>
                      <strategy.icon className={styles.cardIcon} />
                      <motion.h3 layout="position" className={styles.cardTitle}>
                        {strategy.title}
                      </motion.h3>
                    </motion.div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className={styles.cardContent}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto', transition: { delay: 0.1, duration: 0.5 } }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <p className={styles.cardEmphasis}>{strategy.emphasis}</p>
                          <p className={styles.cardDescription}>{strategy.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              className={styles.imageContainer}
              initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
                delay: 0.3
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <img src={imageUrl} alt={t('strategy.image.alt')} className={styles.strategyImage} />
              <div className={styles.imageCaption}>
                <h3 dangerouslySetInnerHTML={{ __html: t('strategy.image.title').replace('<br></br>', '<br/>') }} />
                <p>{t('strategy.image.description')}</p>

                <a href="/strategies" className={styles.discoverButton}>
                  {t('strategy.image.button')}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}