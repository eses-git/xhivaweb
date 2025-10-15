import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { en } from './translations/en';
import { es } from './translations/es'; 

// --- (Keep all your type definitions the same) ---
export type Language = 'en' | 'es';
const translations = {
  en,
  es,
};

export type TranslationKey = keyof typeof translations['en'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// --- CORRECTED PROVIDER ---
export function LanguageProvider({ children }: { children: ReactNode }) {
  // 1. Initialize state with a default value that's consistent on server and client.
  const [language, setLanguageState] = useState<Language>('en');

  // 2. This effect loads the language from localStorage AFTER the initial render.
  // It runs only once on the client-side.
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage);
    }
  }, []); // The empty dependency array [] ensures this runs only once.

  // 3. This effect saves the language back to localStorage whenever it changes.
  useEffect(() => {
    // We check for window to prevent errors in non-browser environments.
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// --- (Your useLanguage hook remains the same) ---
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}