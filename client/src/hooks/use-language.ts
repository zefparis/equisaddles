import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "../lib/translations";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("equi-saddles-language") || "fr";
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("equi-saddles-language", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return React.createElement(
    LanguageContext.Provider,
    {
      value: { language, setLanguage, t }
    },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
