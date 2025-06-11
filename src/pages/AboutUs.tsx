import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles/AboutUs.css';

export const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="about-us-container">
      <h1 className="about-us-title">{t('aboutUs.title')}</h1>
      <p className="about-us-description">{t('aboutUs.description')}</p>
      <div className="about-us-content">
        <h2>{t('aboutUs.missionTitle')}</h2>
        <p>{t('aboutUs.missionText')}</p>
        <h2>{t('aboutUs.visionTitle')}</h2>
        <p>{t('aboutUs.visionText')}</p>
      </div>
    </div>
  );
};
