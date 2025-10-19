// src/components/LanguageSwitcher.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { languageConfig } from './translations/config/languages';
import styles from './LanguageSwitcher.module.css';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguageName = languageConfig[language]?.nativeName || language.toUpperCase();

  // This effect handles closing the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as keyof typeof languageConfig);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className={styles.languageSwitcher} ref={dropdownRef}>
      <button 
        className={styles.dropdownButton} 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe size={18} />
        <span>{currentLanguageName}</span>
        <ChevronDown size={18} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu} role="menu">
          {Object.keys(languageConfig).map((langCode) => (
            <li key={langCode}>
              <button
                className={styles.dropdownItem}
                onClick={() => handleLanguageChange(langCode)}
                role="menuitem"
                disabled={langCode === language} // Disable the currently active language
              >
                {languageConfig[langCode as keyof typeof languageConfig].nativeName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};