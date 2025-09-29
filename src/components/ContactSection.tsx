import { useState } from "react";
import { ArrowRight, Shield, Mail, Phone } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import styles from './ContactSection.module.css';

export function ContactSection() {
  const { t } = useLanguage();
  const [activeMethod, setActiveMethod] = useState('form'); // 'form' is active by default

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
            <h3 className={styles.infoTitle}>Direct Email</h3>
            <p className={styles.infoDescription}>For confidential inquiries and direct correspondence.</p>
            <div className={styles.infoContact}>invest@xhiva.com</div>
            <button className={styles.copyButton} onClick={() => navigator.clipboard.writeText('invest@xhiva.com')}>
              Copy Email Address
            </button>
          </div>
        );
      case 'phone':
        return (
          <div className={styles.infoPanel}>
            <h3 className={styles.infoTitle}>Direct Line</h3>
            <p className={styles.infoDescription}>For immediate consultation and urgent matters.</p>
            <div className={styles.infoContact}>+1 (555) 123-XHIVA</div>
            <p className={styles.infoNote}>By appointment only. Available 24/7 for partners.</p>
          </div>
        );
      case 'form':
      default:
        return (
          <form className={styles.form}>
            <div className={styles.grid}>
              <input type="text" placeholder="Organization Name *" className={styles.input} />
              <input type="text" placeholder="Contact Person *" className={styles.input} />
            </div>
            <div className={styles.grid}>
              <input type="email" placeholder="Email Address *" className={styles.input} />
              <select className={styles.select}>
                <option>Inquiry Type *</option>
                <option>Investment Partnership</option>
                <option>Institutional Services</option>
              </select>
            </div>
            <textarea rows={5} placeholder="Your Message *" className={styles.textarea}></textarea>
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
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.subtitle}>{t('contact.subtitle')}</div>
        <h2 className={styles.title}>{t('contact.title')}</h2>
        <p className={styles.description}>{t('contact.description')}</p>
      </div>

      {/* Main Interactive Grid */}
      <div className={styles.contactGrid}>
        {/* Left Column: Method Selection */}
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

        {/* Right Column: Content Panel */}
        <div className={styles.contentPanel}>
          {renderContent()}
        </div>
      </div>
    </section>
  );
}