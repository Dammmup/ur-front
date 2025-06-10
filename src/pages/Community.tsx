import React from 'react';
// ИСПРАВЛЕНО: импортируем CommunityUsers как именованный компонент
import { CommunityUsers } from '../components/CommunityUsers'; 
import { useTranslation } from 'react-i18next';
import './styles/Community.css';

export const Community: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="community-page-container">
      <h1 className="community-title">{t('communityPage.title')}</h1>
      <p className="community-subtitle">
        {t('communityPage.subtitle')}
      </p>
      {/* В этом контейнере стили не нужны, так как они уже есть в самом компоненте */}
      <CommunityUsers />
    </div>
  );
};