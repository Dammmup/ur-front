import React from 'react';
// ИСПРАВЛЕНО: импортируем CommunityUsers как именованный компонент
import { CommunityUsers } from '../components/CommunityUsers'; 
import { useTranslation } from 'react-i18next';
import './styles/Community.css';
import { Tabs } from 'antd';
import { PostList } from '../components/PostList';

const { TabPane } = Tabs;

export const Community: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <h1 className="title">{t('communityPage.title')}</h1>
      <p className="subtitle">
        {t('communityPage.subtitle')}
      </p>
      <Tabs defaultActiveKey="questions" className="tabs" centered>
        <TabPane tab={t('communityPage.sections.questions')} key="questions">
          <PostList category="question" />
        </TabPane>
        <TabPane tab={t('communityPage.sections.news')} key="news">
          <PostList category="news" />
        </TabPane>
        <TabPane tab={t('communityPage.sections.history')} key="history">
        <PostList category="history" />
                </TabPane>
        <TabPane tab={t('communityPage.sections.people')} key="people">
          <CommunityUsers />        
        </TabPane>
      </Tabs>
    </div>
  );
};