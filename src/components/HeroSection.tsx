import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import './styles/HeroSection.css';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="hero-section">
      <h1 className="hero-title">{t('heroSection.title')}</h1>
      <p className="hero-subtitle">
        {t('heroSection.subtitle')}
      </p>
      <div className="hero-buttons">
        <Button type="primary" size="large" href="/learn" className="hero-button">{t('heroSection.startLearningButton')}</Button>
        <Button type="default" size="large" href="/community" className="hero-button">{t('heroSection.joinCommunityButton')}</Button>
      </div>
    </section>
  );
};
