import { useState } from "react";
import { ArrowRight, Shield, Mail, Phone } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import styles from './ContactSection.module.css';

export function ContactSection() {
  const { t } = useLanguage();
  const [activeMethod, setActiveMethod] = useState('form');

  const contactMethods = [
    { key: 'form', title: 'Secure Inquiry Form', icon: Shield },
    { key: 'email', title: 'Direct Email', icon: Mail },
    { key: 'phone', title: 'Phone Line', icon: Phone },
  ];

  const renderContent = () => {
    switch (activeMethod) {
      case 'email':
        return (
          <div className={styles.infoPanel}>
            <Mail className={styles.infoIcon} />
            <h3 className={styles.infoTitle}>Direct Email</h3>
            <p className={styles.infoDescription}>For confidential inquiries and direct correspondence.</p>
            <div className={styles.infoContact}>invest@xhiva.com</div>
          </div>
        );
      case 'phone':
        return (
          <div className={styles.infoPanel}>
            <Phone className={styles.infoIcon} />
            <h3 className={styles.infoTitle}>Phone Line</h3>
            <p className={styles.infoDescription}>For immediate consultation and urgent matters.</p>
            <div className={styles.infoContact}>+1 (555) 123-XHIVA</div>
          </div>
        );
      case 'form':
      default:
        return (
          <form className={styles.form}>
            <div className={styles.formHeader}>
              <Shield className={styles.infoIcon} />
              <h3 className={styles.infoTitle}>Secure Inquiry Form</h3>
            </div>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <input type="text" id="organization" placeholder=" " className={styles.input} />
                <label htmlFor="organization" className={styles.label}>Organization Name *</label>
              </div>
              <div className={styles.inputGroup}>
                <input type="text" id="contactPerson" placeholder=" " className={styles.input} />
                <label htmlFor="contactPerson" className={styles.label}>Contact Person *</label>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <input type="email" id="email" placeholder=" " className={styles.input} />
              <label htmlFor="email" className={styles.label}>Email Address *</label>
            </div>
            <div className={styles.inputGroup}>
              <textarea id="message" rows={4} placeholder=" " className={styles.input}></textarea>
              <label htmlFor="message" className={styles.label}>Your Message *</label>
            </div>
            <button type="submit" className={styles.submitButton}>
              <span>Submit Inquiry</span>
              <ArrowRight />
            </button>
          </form>
        );
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.header}>
          <div className={styles.subtitle}>{t('contact.subtitle')}</div>
          <h2 className={styles.title}>{t('contact.title')}</h2>
          <p className={styles.description}>{t('contact.description')}</p>
        </div>
        <div className={styles.methodList}>
          {contactMethods.map((method) => (
            <button
              key={method.key}
              className={`${styles.methodButton} ${activeMethod === method.key ? styles.active : ''}`}
              onClick={() => setActiveMethod(method.key)}
            >
              <method.icon className={styles.methodIcon} />
              <span>{method.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        {renderContent()}
      </div>
    </section>
  );
}