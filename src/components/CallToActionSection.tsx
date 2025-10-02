// CallToActionSection.tsx
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import styles from './CallToActionSection.module.css';
import { Link } from "react-router-dom";


export function CallToActionSection() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      {/* Animated Background Elements */}
      <motion.div 
        className={styles.backgroundOverlay}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.3 }} // CHANGED
      >
        <div className={styles.backgroundDiamonds}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.diamond}
              style={{
                left: `${i * 20}%`,
                top: `${i * 15}%`,
              }}
              initial={{ scale: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }} // CHANGED
              exit={{ scale: 0, rotate: 0 }}
              whileInView={{
                scale: 1,
                rotate: 45,
                transition: { 
                  duration: 3, 
                  delay: i * 0.3 
                }
              }}
              animate={{ 
                rotate: [45, 135, 45],
                scale: [1, 1.1, 1],
                transition: { 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className={styles.container}>
        
        {/* Main CTA Content */}
        <motion.div 
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.3 }} // CHANGED
        >
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }} // CHANGED
          >
            {t('cta.title.line1')}
            <br />
            <span className={styles.accentText}>{t('cta.title.accent')}</span>
          </motion.h2>

          <motion.p 
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, amount: 0.3 }} // CHANGED
          >
            {t('cta.description')}
          </motion.p>

          <motion.div 
            className={styles.buttonGroup}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true, amount: 0.3 }} // CHANGED
          >
             <Link to="/contact" className={`${styles.primaryButton} group`}>
              <span>{t('cta.button.primary')}</span>
              <ArrowRight className={styles.arrowIcon} />
          </Link>
            
            <Link to="/funds" className={`${styles.secondaryButton} group`}>
            <span>{t('cta.button.secondary')}</span>
            <ArrowRight className={styles.arrowIcon} />
          </Link>
          </motion.div>
        </motion.div>

        {/* Contact Information Grid */}
        <motion.div 
          className={styles.contactGrid}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }} // CHANGED
        >
         
        </motion.div>

        {/* Qualification Notice */}
        <motion.div 
          className={styles.noticeContainer}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true, amount: 0.3 }} // CHANGED
        >
          <div className={styles.noticeWrapper}>
            <h3 className={styles.noticeTitle}>{t('cta.notice.title')}</h3>
            <p className={styles.noticeText}>
              {t('cta.notice.text')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}