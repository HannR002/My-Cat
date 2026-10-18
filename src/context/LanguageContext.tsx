import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { dbService } from '../services/db';

type TranslationsType = typeof TRANSLATIONS.id;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationsType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('my_cat_lang');
      if (saved === 'en' || saved === 'id') return saved;
    }
    return 'id'; // Bahasa Indonesia is primary
  });

  useEffect(() => {
    // Load from DB if exists
    dbService.getSettings().then((settings) => {
      if (settings && settings.language) {
        setLanguageState(settings.language);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('my_cat_lang', lang);
    }
    dbService.saveSettings({ language: lang }).catch(() => {});
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
