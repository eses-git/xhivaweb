'use client';

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Building2, Heart, Brain, Shield, Coins, Globe, Rocket } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useState, useEffect, useRef } from "react";
import styles from './FundsSection.module.css';

export function FundsSection() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showReplay, setShowReplay] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // The funds array remains the same
  const funds = [
    { icon: Rocket, name: t('funds.item1.name'), focus: t('funds.item1.focus'), philosophy: t('funds.item1.philosophy'), strategy: t('funds.item1.strategy'), allocation: t('funds.item1.allocation'), riskProfile: t('funds.item1.riskProfile'), investmentHorizon: t('funds.item1.investmentHorizon'), targetIRR: t('funds.item1.targetIRR') },
    { icon: Building2, name: t('funds.item2.name'), focus: t('funds.item2.focus'), philosophy: t('funds.item2.philosophy'), strategy: t('funds.item2.strategy'), allocation: t('funds.item2.allocation'), riskProfile: t('funds.item2.riskProfile'), investmentHorizon: t('funds.item2.investmentHorizon'), targetIRR: t('funds.item2.targetIRR') },
    { icon: Heart, name: t('funds.item3.name'), focus: t('funds.item3.focus'), philosophy: t('funds.item3.philosophy'), strategy: t('funds.item3.strategy'), allocation: t('funds.item3.allocation'), riskProfile: t('funds.item3.riskProfile'), investmentHorizon: t('funds.item3.investmentHorizon'), targetIRR: t('funds.item3.targetIRR') },
    { icon: Brain, name: t('funds.item4.name'), focus: t('funds.item4.focus'), philosophy: t('funds.item4.philosophy'), strategy: t('funds.item4.strategy'), allocation: t('funds.item4.allocation'), riskProfile: t('funds.item4.riskProfile'), investmentHorizon: t('funds.item4.investmentHorizon'), targetIRR: t('funds.item4.targetIRR') },
    { icon: Coins, name: t('funds.item5.name'), focus: t('funds.item5.focus'), philosophy: t('funds.item5.philosophy'), strategy: t('funds.item5.strategy'), allocation: t('funds.item5.allocation'), riskProfile: t('funds.item5.riskProfile'), investmentHorizon: t('funds.item5.investmentHorizon'), targetIRR: t('funds.item5.targetIRR') },
    { icon: TrendingUp, name: t('funds.item6.name'), focus: t('funds.item6.focus'), philosophy: t('funds.item6.philosophy'), strategy: t('funds.item6.strategy'), allocation: t('funds.item6.allocation'), riskProfile: t('funds.item6.riskProfile'), investmentHorizon: t('funds.item6.investmentHorizon'), targetIRR: t('funds.item6.targetIRR') },
    { icon: Globe, name: t('funds.item7.name'), focus: t('funds.item7.focus'), philosophy: t('funds.item7.philosophy'), strategy: t('funds.item7.strategy'), allocation: t('funds.item7.allocation'), riskProfile: t('funds.item7.riskProfile'), investmentHorizon: t('funds.item7.investmentHorizon'), targetIRR: t('funds.item7.targetIRR') },
    { icon: Shield, name: t('funds.item8.name'), focus: t('funds.item8.focus'), philosophy: t('funds.item8.philosophy'), strategy: t('funds.item8.strategy'), allocation: t('funds.item8.allocation'), riskProfile: t('funds.item8.riskProfile'), investmentHorizon: t('funds.item8.investmentHorizon'), targetIRR: t('funds.item8.targetIRR') },
    { icon: TrendingUp, name: t('funds.item9.name'), focus: t('funds.item9.focus'), philosophy: t('funds.item9.philosophy'), strategy: t('funds.item9.strategy'), allocation: t('funds.item9.allocation'), riskProfile: t('funds.item9.riskProfile'), investmentHorizon: t('funds.item9.investmentHorizon'), targetIRR: t('funds.item9.targetIRR') }
  ];

  const currentFund = funds[currentIndex];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % funds.length);
    }, 6000); 

    return () => clearInterval(intervalId);
  }, [funds.length]);

  const handleFundChange = (index: number) => {
    setCurrentIndex(index);
    if (cardRef.current) {
      const headerHeight = 50;
      const top = cardRef.current.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // UPDATED: handleReplay is now cleaner.
  // The onPlay event on the video will handle hiding the button.
  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <section className={styles.sectionWrapper}>
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline
        onPlay={() => setShowReplay(false)} // ADDED: Hides button on play
        onEnded={() => setShowReplay(true)} // Shows button on end
        style={{ 
          position: 'fixed', 
          top: '50px', 
          left: 0, 
          width: '100%', 
          height: '80%', 
          objectFit: 'cover', 
          filter: 'brightness(1.2) opacity(0.5)',
          zIndex: -1 ,
        }}
      >
        <source src="/videos/gold-world.mp4" type="video/mp4" />
        {t('funds.videoFallback')}
      </video>
 
      {/* ADDED: Conditionally rendered replay button */}
      {showReplay && (
        <button onClick={handleReplay} className={styles.replayButton}>
        </button>
      )}

      <div className={styles.contentContainer}>
        {/* Header Section */}
        <motion.div className={styles.headerText} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} viewport={{ once: true }}>
          <div className={styles.subtitle}>{t('funds.subtitle')}</div>
          <h2 className={styles.title}>{t('funds.title')}</h2>
        </motion.div>
        
        {/* Blue description box */}
        <motion.div
          className={styles.descriptionWrapper}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <div className={styles.descriptionContent}>
            <p className={styles.descriptionText}>
              {t('funds.description')}
            </p>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className={styles.interactiveContainer}>
          {/* Buttons Column */}
          <div className={styles.buttonsColumn}>
            {funds.map((fund, index) => (
              <motion.div 
                key={fund.name} 
                className={`${styles.fundButton} ${currentIndex === index ? styles.active : ''}`} 
                onClick={() => handleFundChange(index)} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className={styles.buttonIconWrapper}><fund.icon className={styles.buttonIcon} /></div>
                <h3 className={styles.buttonTitle}>{fund.name}</h3>
              </motion.div>
            ))}
          </div>

          {/* Detailed Card */}
          <motion.div 
            ref={cardRef}
            key={currentFund.name} 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1.2, ease: "easeOut" }} 
            className={styles.cardContainer}
          >
            <div className={styles.waveCard}>
              <div className={styles.waveContent}>
                <div className={styles.waveHeader}>
                  <div className={styles.waveIcon}><currentFund.icon/></div>
                  <div>
                    <h3 className={styles.waveTitle}>{currentFund.name}</h3>
                    <p className={styles.waveSubtitle}>{currentFund.focus}</p>
                  </div>
                </div>
                <div className={styles.waveBody}>
                  <h4 className={styles.contentHeading}>{t('funds.details.philosophy')}</h4>
                  <p>{currentFund.philosophy}</p>
                  <h4 className={styles.contentHeading}>{t('funds.details.strategy')}</h4>
                  <p>{currentFund.strategy}</p>
                  <h4 className={styles.contentHeading}>{t('funds.details.allocation')}</h4>
                  <p>{currentFund.allocation}</p>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}