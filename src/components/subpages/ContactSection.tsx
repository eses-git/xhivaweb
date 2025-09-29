// src/components/ContactSection.tsx

import React from 'react';
import styles from './ContactSection.module.css';
import { Mail, Phone, MapPin } from 'lucide-react';
import { AnimatedBackgroundWrapper } from '../background/isometric-background/AnimatedBackgroundWrapperGold';
import { useLanguage } from '../LanguageContext'; // 1. Import the hook

export function ContactSection() {
  const { t } = useLanguage(); // 2. Initialize the translation function
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <AnimatedBackgroundWrapper className={styles.contactSection}>
      <div className={styles.contentWrapper}>
        
        {/* 3. Replace all hardcoded text with t() calls */}
        <header className={styles.header}>
          <p className={styles.preTitle}>{t('contact.preTitle')}</p>
          <h1 className={styles.title}>{t('contact.title')}</h1>
          <p className={styles.introText}>{t('contact.introText')}</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">{t('contact.form.nameLabel')}</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">{t('contact.form.emailLabel')}</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">{t('contact.form.messageLabel')}</label>
            <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required />
          </div>
          <button type="submit" className={styles.submitButton}>
            {t('contact.form.submitButton')}
          </button>
        </form>

        <footer className={styles.footerDetails}>
          <div className={styles.detailItem}>
            <Mail size={18} />
            <span>{t('contact.details.email')}</span>
          </div>
          <div className={styles.detailItem}>
            <Phone size={18} />
            <span>{t('contact.details.phone')}</span>
          </div>
          <div className={styles.detailItem}>
            <MapPin size={18} />
            <span>{t('contact.details.office')}</span>
          </div>
        </footer>

      </div>
    </AnimatedBackgroundWrapper>
  );
}