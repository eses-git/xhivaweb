import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Users } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import styles from './AboutSection.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // ADDED: Imports for screen size detection

const featureIcons = [Star, Shield, Users];

export function AboutSection() {
  const { t } = useLanguage();

  // ADDED: State and effect to detect mobile screen sizes
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on initial load
    checkIsMobile();

    // Add listener for screen resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  // END of added block

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

  // ADDED: Animation variants for cleaner conditional logic
  const darkPanelVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const pillarCardVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section className={styles.aboutSection}>
      <div className={styles.dualToneGrid}>
        {/* Dark Left Panel */}
        <motion.div 
          className={styles.darkPanel}
          // CHANGED: Use variants and conditionally disable animation on mobile
          variants={darkPanelVariants}
          initial={isMobile ? "visible" : "hidden"}
          whileInView="visible"
          transition={{ duration: 1, ease: "easeOut" }}
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
                  // CHANGED: Use variants and conditionally disable animation on mobile
                  variants={pillarCardVariants}
                  initial={isMobile ? "visible" : "hidden"}
                  whileInView="visible"
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    // Conditionally disable the stagger delay on mobile
                    delay: isMobile ? 0 : index * 0.2 
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