// src/components/ProtocolSection.tsx

import { motion, Variants } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import styles from './ProtocolSection.module.css';
import { FileText, UserCheck, Lock, PenSquare, CheckCircle } from 'lucide-react';

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut",
      staggerChildren: 0.2
    } 
  }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

export function ProtocolSection() {
  const { t } = useLanguage();

  const protocolSteps = [
    { icon: <FileText />, titleKey: 'protocol.step1.title', descriptionKey: 'protocol.step1.description' },
    { icon: <UserCheck />, titleKey: 'protocol.step2.title', descriptionKey: 'protocol.step2.description' },
    { icon: <Lock />, titleKey: 'protocol.step3.title', descriptionKey: 'protocol.step3.description' },
    { icon: <PenSquare />, titleKey: 'protocol.step4.title', descriptionKey: 'protocol.step4.description' },
    { icon: <CheckCircle />, titleKey: 'protocol.step5.title', descriptionKey: 'protocol.step5.description' },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.header 
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
        >
          <p className={styles.preTitle}>{t('protocol.preTitle')}</p>
          <h1 className={styles.title}>{t('protocol.title')}</h1>
        </motion.header>

        <motion.div 
          className={styles.timelineContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          {protocolSteps.map((step, index) => (
            <motion.div key={index} className={styles.timelineItem} variants={itemVariants}>
              <div className={styles.timelineGraphic}>
                <div className={styles.timelineIcon}>{step.icon}</div>
              </div>
              <div className={styles.timelineContent}>
                <h3 className={styles.stepTitle}>{t(step.titleKey as any)}</h3>
                <p className={styles.stepDescription}>{t(step.descriptionKey as any)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}