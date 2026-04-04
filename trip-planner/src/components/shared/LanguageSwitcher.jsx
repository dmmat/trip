import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(next);
    localStorage.setItem('language', next);
  };

  const label = i18n.language === 'uk' ? 'EN' : 'UA';
  const tip = i18n.language === 'uk' ? 'Switch to English' : 'Перемкнути на українську';

  return (
    <Tooltip label={tip} withArrow>
      <ActionIcon variant="subtle" color="gray" size="lg" onClick={toggle} aria-label={tip}>
        <IconLanguage size={20} />
      </ActionIcon>
    </Tooltip>
  );
};

export default LanguageSwitcher;
