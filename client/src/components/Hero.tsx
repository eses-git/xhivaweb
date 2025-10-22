// Hero.tsx
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { InteractiveConnectionsBackground } from './background/interactive-connections-background/interactive-connections-background';
import styles from './Hero.module.css';
import { Link } from "react-router-dom";

export function Hero() {
  const { t } = useLanguage();

  return (
    // This <section> is the main parent and has "position: relative" from your CSS.
    <section className={styles.heroSection}>
      
      {/* 1. RENDER THE BACKGROUND: It's now a sibling, at z-index 0. 
         It will be positioned absolutely to fill this parent section. */}
      <InteractiveConnectionsBackground />

      {/* 2. RENDER THE CONTENT: This is now a sibling, with "position: relative" 
         and a z-index to ensure it renders on top of the background. */}
      <div className={`${styles.container} relative z-10`}>
        <div className={styles.layoutContainer}>
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Left side: Main title (Animations removed for LCP) */}
            <div className={styles.leftContainer}>
              <h1 className={styles.title}>
                <span>{t('hero.title')}</span>
                <span>{t('hero.title1')}</span>
                <span>{t('hero.title2')}</span>
              </h1>
            </div>

            {/* Right side: Description and actions (Animations kept) */}
            <div className={styles.rightContainer}>
              <motion.p
                className={styles.description}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                {t('hero.description')}
              </motion.p>
              
              <motion.div
                className={styles.actions}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Link to="/impact" className={styles.ctaButton}>
                  <span>{t('hero.cta')}</span>
                </Link>
                <button
                  className={styles.demoButton}
                  onClick={() => {
                    const section = document.getElementById("strategy");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <span>{t('hero.viewDemo')}</span>
                  <ArrowRight className={`${styles.icon} ${styles.demoIcon}`} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}