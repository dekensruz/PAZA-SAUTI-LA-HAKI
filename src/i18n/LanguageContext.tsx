import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { content, type Language } from './content';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof content.fr;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const KEY = 'pslh-lang';

function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    /* stockage indisponible */
  }
  return 'fr';
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(KEY, language);
    } catch {
      /* ignore */
    }
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage, t: content[language] }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
