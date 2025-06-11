import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from 'antd';
import { LEVELS } from '../constants';
import './styles/Pricing.css';

export const Pricing: React.FC = () => {
  const { t } = useTranslation('pricing');

  return (
    <div className="pricing-container">
      <h1 className="pricing-title">{t('title')}</h1>
      <p className="pricing-subtitle">{t('subtitle')}</p>
      <div className="pricing-cards">
        {LEVELS.map(lvl => (
          <Card key={lvl.value} title={t(`plans.${lvl.value}.title`)} className="pricing-card">
            <p>{t(`plans.${lvl.value}.description`)}</p>
            <Button type="primary">{t(`plans.${lvl.value}.button`)}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
