import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from 'antd';
import { LEVELS } from '../constants';
import './styles/Pricing.css';

export const Pricing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pricing-container">
      <h1 className="pricing-title">{t('pricing.title')}</h1>
      <p className="pricing-subtitle">{t('pricing.subtitle')}</p>
      <div className="pricing-cards">
        {LEVELS.map(lvl => (
          <Card key={lvl.value} title={t(`pricing.plans.${lvl.value}.title`)} className="pricing-card">
            <p>{t(`pricing.plans.${lvl.value}.description`)}</p>
            <Button type="primary">{t(`pricing.plans.${lvl.value}.button`)}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
