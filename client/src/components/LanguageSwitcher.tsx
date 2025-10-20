// src/components/LanguageSwitcher.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
// Assuming Language type is exported from LanguageContext
import { Language } from './LanguageContext'; 
import { languageConfig } from './translations/config/languages';
import styles from './LanguageSwitcher.module.css';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguageName = languageConfig[language]?.nativeName || language.toUpperCase();

  // --- SORTING LOGIC ---
  // 1. Get all language codes except 'en'
  const otherLangCodes = (Object.keys(languageConfig) as Language[]).filter(
    (code) => code !== 'en'
  );

  // 2. Sort the other language codes based on their nativeName
  otherLangCodes.sort((a, b) => {
    const nameA = languageConfig[a].nativeName.toUpperCase(); // Ignore case
    const nameB = languageConfig[b].nativeName.toUpperCase(); // Ignore case
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0; // names must be equal
  });

  // 3. Create the final sorted list with 'en' first
  const sortedLangCodes: Language[] = ['en', ...otherLangCodes];
  // --- END SORTING LOGIC ---


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

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false); 
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
          {/* 4. Map over the NEW sorted list */}
          {sortedLangCodes.map((langCode) => (
            <li key={langCode}>
              <button
                className={styles.dropdownItem}
                onClick={() => handleLanguageChange(langCode)}
                role="menuitem"
                disabled={langCode === language} 
              >
                {languageConfig[langCode].nativeName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};