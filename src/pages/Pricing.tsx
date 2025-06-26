import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from 'antd';
import { LEVELS } from '../constants';
import './styles/Pricing.css';

// TODO: Replace with actual WhatsApp number from environment variables or configuration
// @ts-ignore: Ignore error about process not being defined
const WHATSAPP_NUMBER =  '+77089358975'; // Placeholder - should be in format 1234567890 (no spaces, no symbols)

export const Pricing: React.FC = () => {
  const { t } = useTranslation();

  const handleWhatsAppRedirect = (planName: string) => {
    // Get the translated plan title for the message
    const planTitle = t(`pricing.plans.${planName}.title`);
    
    // Get the translated message and replace the plan placeholder
    let message = t('pricing.whatsappMessage', { plan: planTitle });
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create the WhatsApp URL
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pricing-container">
      <h1 className="pricing-title">{t('pricing.title')}</h1>
      <p className="pricing-subtitle">{t('pricing.subtitle')}</p>
      <div className="pricing-cards" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {LEVELS.map(lvl => (
          <Card 
            key={lvl.value} 
            title={t(`pricing.plans.${lvl.value}.title`)} 
            className="pricing-card"
            style={{ margin: '0 auto',alignContent: 'center',alignItems: 'center',justifyContent: 'center',width: '120%',display: 'flex' }}
            actions={[
              <Button 
                key="select" 
                type="primary" 
                onClick={() => handleWhatsAppRedirect(lvl.value)}
                style={{ width: '80%', margin: '0 auto' }}
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
