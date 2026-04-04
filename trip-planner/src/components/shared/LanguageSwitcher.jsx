import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1 px-2 py-1 text-sm rounded-md hover:bg-gray-100 text-gray-600 ${className}`}
      title={i18n.language === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium uppercase">{i18n.language === 'uk' ? 'EN' : 'UA'}</span>
    </button>
  );
};

export default LanguageSwitcher;
