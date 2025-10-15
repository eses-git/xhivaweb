// Footer.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowRight, X } from "lucide-react";
import { useLanguage, TranslationKey } from "./LanguageContext";
import logo from './assets/logo-thick-white.png';
import styles from './Footer.module.css';

// --- TYPE DEFINITION FIX: Define a more specific type for the links ---
type FooterLink = {
  name: string;
  href: string;
  onClick?: () => void; // The '?' makes onClick optional
};

// Modal component (no changes needed here)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.modalBackdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <div className={styles.modalContainer} onClick={onClose}>
            <motion.div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <button onClick={onClose} className={styles.modalCloseButton}>
                  <X size={24} />
                </button>
              </div>
              <div className={styles.modalBody}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export function Footer() {
  const { t, language, setLanguage } = useLanguage();

  const modalContent = {
    disclaimer: {
      title: t('footer.modal.disclaimer.title'),
      content: (
        <>
        
          <p>{t('footer.modal.disclaimer.p1')}</p>
          <p>{t('footer.modal.disclaimer.p2')}</p>
          <p>{t('footer.modal.disclaimer.p3')}</p>
        </>
      )
    },
    privacy: {
      title: t('footer.modal.privacy.title'),
      content: (
        <>
          <p><strong>{t('footer.modal.privacy.effectiveDate')}</strong></p>
          <p>{t('footer.modal.privacy.p1')}</p>
          <p>{t('footer.modal.privacy.p2')}</p>
          <p>{t('footer.modal.privacy.p3')}</p>
          <p dangerouslySetInnerHTML={{ __html: t('footer.modal.privacy.p4') }} />

        </>
      )
    },
    terms: {
      title: t('footer.modal.terms.title'),
      content: (
        <>
          <p><strong>{t('footer.modal.terms.effectiveDate')}</strong></p>
          <p>{t('footer.modal.terms.p1')}</p>
          <p>{t('footer.modal.terms.p2')}</p>
          <p dangerouslySetInnerHTML={{ __html: t('footer.modal.terms.p3') }} />
        </>
      )
    }
  };
  
  const [openModal, setOpenModal] = useState<keyof typeof modalContent | null>(null);

  // Apply the new FooterLink type here
  const footerSections: { title: string; links: FooterLink[] }[] = [
    {
      title: t('footer.company'),
      links: [
        { name: t('nav.about'), href: "/about-us" },
        { name: t('nav.impact'), href: "/impact" },
      ]
    },
    {
      title: t('footer.services'),
      links: [
        { name: t('nav.services'), href: "/services" },
        { name: t('nav.strategy'), href: "/#strategy" },
        { name: t('footer.globalFunds'), href: "/funds" },
        { name: t('nav.partnerships'), href: "/partnership" }
      ]
    },
    {
      title: t('footer.legal'),
      links: [
        { name: t('footer.disclaimer'), href: "#", onClick: () => setOpenModal('disclaimer') },
        { name: t('footer.privacy'), href: "#", onClick: () => setOpenModal('privacy') },
        { name: t('footer.terms'), href: "#", onClick: () => setOpenModal('terms') },
        { name: t('cookie.footerLink'), href: "/cookie-policy" },
      ]
    },
    {
      title: t('footer.connect'),
      links: [
        { name: t('nav.contact'), href: "/contact" },
        { name: t('nav.careers'), href: "/careers" },

      ]
    }
  ];

  return (
    <>
      <footer className={styles.section}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.container}>
          <div className={styles.mainGrid}>
            <motion.div 
              className={styles.brandSection}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className={styles.logoContainer}>
                <img src={logo} alt={t('footer.logoAlt')} className={styles.logo} />
                <span className={styles.logoText}>{t('footer.logoText')}</span>
              </div>
              <p className={styles.brandDescription}>
                {t('footer.brandDescription')}
              </p>
              <div className={styles.languageSwitcher}>
                <Globe className={styles.languageIcon} />
                <button
                  onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                  className={styles.languageButton}
                >
                  {language === 'en' ? t('footer.language.es') : t('footer.language.en')}


                </button>
              </div>
            </motion.div>

            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                className={styles.linkSection}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <ul className={styles.linkList}>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {/* --- RENDERING FIX: Check if link.onClick exists --- */}
                      {link.onClick ? (
                        <button
                          onClick={link.onClick}
                          className={styles.link}
                        >
                          {link.name}
                        </button>
                      ) : (
                        <a
                          href={link.href}
                          className={styles.link}
                        >
                          {link.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className={styles.newsletterSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false, amount: 0.3 }}
            style={{display:'none'}}
          >
            <div className={styles.newsletterContent}>
              <h3 className={styles.newsletterTitle}>{t('footer.newsletterTitle')}</h3>
              <p className={styles.newsletterDescription}>
                {t('footer.newsletterDescription')}
              </p>
              <div className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className={styles.emailInput}
                />
                <button className={`${styles.subscribeButton} group`}>
                  <span>{t('footer.subscribe')}</span>
                  <ArrowRight className={styles.subscribeIcon} />
                </button>
              </div>
              <p className={styles.newsletterNote}>
                {t('footer.newsletterNote')}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className={styles.bottomSection}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className={styles.bottomContent}>
              <div className={styles.copyright}>
                {t('footer.copyright')}
              </div>
              <div className={styles.regulatedContainer}>
                <span className={styles.regulatedLabel}>{t('footer.regulatedBy')}</span>
                <div className={styles.regulatedList}>
                  <a href="https://www.sec.gov/" target="_blank" rel="noopener noreferrer" className={styles.regulatedLink}>SEC</a>
                  <span>•</span>
                  <a href="https://www.fca.org.uk/" target="_blank" rel="noopener noreferrer" className={styles.regulatedLink}>FCA</a>
                  <span>•</span>
                  <a href="https://www.finma.ch/en/" target="_blank" rel="noopener noreferrer" className={styles.regulatedLink}>FINMA</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className={styles.backgroundGlow}></div>
      </footer>

      <Modal
        isOpen={openModal !== null}
        onClose={() => setOpenModal(null)}
        title={openModal ? modalContent[openModal]?.title : ''}
      >

        {openModal ? modalContent[openModal]?.content : null}
      </Modal>
    </>
  );
}
