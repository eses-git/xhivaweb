// ServicesSection.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, PieChart, Users, Shield, Leaf, Handshake } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useState, useEffect, useRef } from "react";
import styles from './ServicesSection.module.css';
import NeuralConnections from '../background/interactive-network-small/interactive-network-small';

export function ServicesSection() {
  const { t } = useLanguage();
  
  const services = [
    { id: 'asset-management', icon: PieChart, title: t('services.item1.title'), subtitle: t('services.item1.subtitle'), description: t('services.item1.description'), details: { focus: t('services.item1.details.focus'), approach: t('services.item1.details.approach'), delivery: t('services.item1.details.delivery') } },
    { id: 'portfolio-construction', icon: Briefcase, title: t('services.item2.title'), subtitle: t('services.item2.subtitle'), description: t('services.item2.description'), details: { focus: t('services.item2.details.focus'), approach: t('services.item2.details.approach'), delivery: t('services.item2.details.delivery') } },
    { id: 'wealth-planning', icon: Users, title: t('services.item3.title'), subtitle: t('services.item3.subtitle'), description: t('services.item3.description'), details: { focus: t('services.item3.details.focus'), approach: t('services.item3.details.approach'), delivery: t('services.item3.details.delivery') } },
    { id: 'fiduciary-services', icon: Shield, title: t('services.item4.title'), subtitle: t('services.item4.subtitle'), description: t('services.item4.description'), details: { focus: t('services.item4.details.focus'), approach: t('services.item4.details.approach'), delivery: t('services.item4.details.delivery') } },
    { id: 'esg-advisory', icon: Leaf, title: t('services.item5.title'), subtitle: t('services.item5.subtitle'), description: t('services.item5.description'), details: { focus: t('services.item5.details.focus'), approach: t('services.item5.details.approach'), delivery: t('services.item5.details.delivery') } },
    { id: 'co-investment', icon: Handshake, title: t('services.item6.title'), subtitle: t('services.item6.subtitle'), description: t('services.item6.description'), details: { focus: t('services.item6.details.focus'), approach: t('services.item6.details.approach'), delivery: t('services.item6.details.delivery') } }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex];

  const [isMobile, setIsMobile] = useState(false);
  const [spotlightY, setSpotlightY] = useState(0);
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // --- FIX: Create a ref to hold the interval ID ---
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- FIX: Create a function to start/reset the timer ---
  const startTimer = () => {
    // Clear the old timer if it exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Start a new timer and save its ID
    intervalRef.current = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % services.length);
    }, 6000);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023); 
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // This useEffect now manages the timer lifecycle
  useEffect(() => {
    // Start the timer when the component mounts
    startTimer();

    // Cleanup: clear the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [services.length]);

  // Updated useEffect to only calculate spotlight on desktop
  useEffect(() => {
    if (!isMobile) { 
      const currentButton = buttonRefs.current[activeIndex];
      if (currentButton) {
        setSpotlightY(currentButton.offsetTop);
      }
    }
  }, [activeIndex, isMobile]);

  // --- FIX: Create a single handler for changing services ---
  const handleServiceChange = (index: number) => {
    setActiveIndex(index);
    startTimer(); // This resets the 6-second timer
  };

  return (
    <section id="services" className={styles.servicesSection}>
      <NeuralConnections>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className={styles.subtitle}>{t('services.preTitle')}</div>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>{t('services.title')}</h2>
          </div>
        </motion.div>

        <div className={styles.serviceLayout}>
          {/* --- Mobile Icon Navigation --- */}
          <div className={styles.serviceIconsMobile}>
            {services.map((service, index) => (
              <button
                key={`icon-${service.id}`}
                className={`${styles.iconButtonMobile} ${activeIndex === index ? styles.active : ''}`}
                onClick={() => handleServiceChange(index)} // Use new handler
                aria-label={`Select ${service.title}`}
              >
                <service.icon className={styles.iconInButton} />
              </button>
            ))}
          </div>
          
          {/* --- Desktop Button List --- */}
          <div ref={listWrapperRef} className={styles.serviceListWrapper}>
            {!isMobile && (
              <motion.div
                className={styles.spotlight}
                animate={{ y: spotlightY }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            )}
            {services.map((service, index) => (
              <button
                key={service.id}
                ref={el => { buttonRefs.current[index] = el; }} 
                className={`${styles.serviceButton} ${activeIndex === index ? styles.active : ''}`}
                onClick={() => handleServiceChange(index)} // Use new handler
              >
                <service.icon className={styles.buttonIcon} />
                <span className={styles.buttonTitle}>{service.title}</span>
              </button>
            ))}
          </div>

          {/* --- Details Panel (Content Card) --- */}
          <div className={styles.detailsPanel}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className={styles.detailsSubtitle}>{activeService.subtitle}</p>
                <h3 className={styles.detailsTitle}>{activeService.title}</h3>
                <p className={styles.detailsDescription}>{activeService.description}</p>
                <div className={styles.detailsGrid}>
                  <div>
                    <h4 className={styles.gridTitle}>{t('services.details.focusTitle')}</h4>
                    <p className={styles.gridText}>{activeService.details.focus}</p>
                  </div>
                  <div>
                    <h4 className={styles.gridTitle}>{t('services.details.approachTitle')}</h4>
                    <p className={styles.gridText}>{activeService.details.approach}</p>
                  </div>
                  <div>
                    <h4 className={styles.gridTitle}>{t('services.details.deliveryTitle')}</h4>
                    <p className={styles.gridText}>{activeService.details.delivery}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </NeuralConnections>
    </section>
  );
}