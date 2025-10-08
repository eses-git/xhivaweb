// src/components/ContactSection.tsx

import React, { useRef, useState } from 'react';
import styles from './ContactSection.module.css';
import { Mail, Phone, MapPin } from 'lucide-react';
import { AnimatedBackgroundWrapper } from '../background/isometric-background/AnimatedBackgroundWrapperGold';
import { useLanguage } from '../LanguageContext';
import { Modal } from '../Modal';

export function ContactSection() {
  const { t } = useLanguage();
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const openModal = (type: 'success' | 'error', title: string, message: string) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('info');
    setModalTitle('');
    setModalMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;
    setIsSubmitting(true);

    const formData = new FormData(form.current);
    const data = Object.fromEntries(formData.entries());
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
``

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unknown error occurred.');
      }

      openModal('success', t('contact.modal.successTitle'), result.message);
      form.current?.reset();

    } catch (error: any) {
      console.error('Submission failed:', error);
      openModal('error', t('contact.modal.errorTitle'), error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedBackgroundWrapper className={styles.contactSection}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <p className={styles.preTitle}>{t('contact.preTitle')}</p>
          <h1 className={styles.title}>{t('contact.title')}</h1>
          <p className={styles.introText}>{t('contact.introText')}</p>
        </header>

        <form ref={form} onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">{t('contact.form.nameLabel')}</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">{t('contact.form.emailLabel')}</label>
              <input type="email" id="email" name="email" required />
            </div>
          </div>

          {/* --- ADD THIS NEW BLOCK FOR THE SUBJECT FIELD --- */}
          <div className={styles.formGroup}>
            <label htmlFor="subject">{t('contact.form.subjectLabel')}</label>
            <input type="text" id="subject" name="subject" required />
          </div>
          {/* ------------------------------------------- */}

          <div className={styles.formGroup}>
            <label htmlFor="message">{t('contact.form.messageLabel')}</label>
            <textarea id="message" name="message" rows={5} required />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? t('contact.form.sendingButton') : t('contact.form.submitButton')}
          </button>
        </form>

        <div className={styles.footerDetails}>
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
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />
    </AnimatedBackgroundWrapper>
  );
}