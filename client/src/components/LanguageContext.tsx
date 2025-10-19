import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { en } from './translations/en';
import { es } from './translations/es'; 
import { ru } from './translations/ru';
import { zh } from './translations/zh';
import { ar } from './translations/ar';
import { fr } from './translations/fr';
import { th } from './translations/th';
import { vi } from './translations/vi';
import { de } from './translations/de';
import { ja } from './translations/ja';
import { ko } from './translations/ko';
import { pt } from './translations/pt';
import { he } from './translations/he';
import { ur } from './translations/ur'; // 1. Import 'ur'

const translations = {
  en,
  es,
  ru,
  zh,
  ar,
  fr,
  th,
  vi,
  de,
  ja,
  ko,
  pt,
  he,
  ur, // 2. Add 'ur' to the object
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en'];

const typedTranslations: Record<Language, Record<TranslationKey, string>> = translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage') as Language;
    if (savedLanguage && (savedLanguage in typedTranslations)) {
      setLanguageState(savedLanguage);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.language) {
      let browserLang = navigator.language.split('-')[0]; // e.g., 'ur', 'he', 'pt'
      
      if (browserLang === 'zh') browserLang = 'zh'; 
      if (browserLang === 'iw') browserLang = 'he'; // Handle older Hebrew code if necessary
      
      if (browserLang in typedTranslations) {
        setLanguageState(browserLang as Language);
        return;
      }
    }

    setLanguageState('en');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', language);
      
      // 3. Add 'ur' to the RTL check
      if (language === 'ar' || language === 'he' || language === 'ur') { 
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return typedTranslations[language]?.[key] || typedTranslations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}