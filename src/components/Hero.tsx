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
    <section className={styles.heroSection}>
      <InteractiveConnectionsBackground>
        <div className={styles.container}>
          <div className={styles.layoutContainer}>
            <motion.div
              className={styles.content}
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }} // Smooth exit for scroll-up
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }} // Replay animation on scroll
            >
              {/* Left side: Main title */}
              <div className={styles.leftContainer}>
                <motion.h1
                  className={styles.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }} // Smooth exit for scroll-up
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <span>{t('hero.title')}</span>
                  <span>{t('hero.title1')}</span>
                  <span>{t('hero.title2')}</span>
                </motion.h1>
              </div>

              {/* Right side: Description and actions */}
              <div className={styles.rightContainer}>
                <motion.p
                  className={styles.description}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }} // Smooth exit for scroll-up
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: false, amount: 0.3 }}
                >
                  {t('hero.description')}
                </motion.p>
                
                <motion.div
                  className={styles.actions}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }} // Smooth exit for scroll-up
                  transition={{ duration: 0.6, delay: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
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
      </InteractiveConnectionsBackground>
    </section>
  );
}