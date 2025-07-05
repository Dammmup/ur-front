import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from 'antd';
import { LEVELS } from '../constants';
import './styles/Pricing.css';

const WHATSAPP_NUMBER =  '+77089358975';

export const Pricing: React.FC = () => {
  const { t } = useTranslation();

  const handleWhatsAppRedirect = (planName: string) => {
    const planTitle = t(`pricing.plans.${planName}.title`);
    let message = t('pricing.whatsappMessage', { plan: planTitle });
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pricing-container">
      <h1 className="pricing-title">{t('pricing.title')}</h1>
      <p className="pricing-subtitle">{t('pricing.subtitle')}</p>
      <div className="pricing-cards">
        {LEVELS.map(lvl => (
          <Card 
            key={lvl.value} 
            title={t(`pricing.plans.${lvl.value}.title`)} 
            className="pricing-card centered"
            actions={[
              <Button 
                key="select" 
                type="primary" 
                onClick={() => handleWhatsAppRedirect(lvl.value)}
                className="centered-button"
              >
                {t(`pricing.plans.${lvl.value}.button`)}
              </Button>
            ]}
          >
            <p>{t(`pricing.plans.${lvl.value}.description`)}</p>
          </Card>
        ))}
      </div>
    </div>
  )
};
