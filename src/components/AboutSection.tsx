import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star, Shield, Users } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import styles from './AboutSection.module.css';
import { Link } from 'react-router-dom';

const featureIcons = [Star, Shield, Users];

export function AboutSection() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      title: t('about.feature1-title'),
      description: t('about.feature1-desc'),
    },
    {
      title: t('about.feature2-title'),
      description: t('about.feature2-desc'),
    },
    {
      title: t('about.feature3-title'),
      description: t('about.feature3-desc'),
    }
  ];

  return (
    <section className={styles.aboutSection}>
      <div className={styles.dualToneGrid}>
        {/* Dark Left Panel */}
        <motion.div 
          className={styles.darkPanel}
          initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <p className={styles.description}>
            {t('about.description')}
          </p>
           <Link to="/about-us" className={styles.ctaButton}>
            <span>{t('about.learnMore')}</span>
             <ArrowRight className={styles.ctaIcon} />
            </Link>
        </motion.div>

        {/* Light Right Panel */}
        <div className={styles.lightPanel}>
          <div className={styles.pillarsWrapper}> 
            {features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <motion.div
                  key={feature.title}
                  className={styles.pillarCard}
                  initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  // CHANGED: Replaced duration/ease with a spring transition for a more fluid feel
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: index * 0.2 
                  }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className={styles.pillarIcon}>
                    <Icon />
                  </div>
                  <div>
                    <h3 className={styles.pillarTitle}>{feature.title}</h3>
                    <p className={styles.pillarDescription}>{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}