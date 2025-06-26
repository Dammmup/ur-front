import React from 'react';
// ИСПРАВЛЕНО: импортируем CommunityUsers как именованный компонент
import { CommunityUsers } from '../components/CommunityUsers'; 
import { useTranslation } from 'react-i18next';
import styles from './styles/Community.module.css';
import { Tabs } from 'antd';
import { PostList } from '../components/PostList';

const { TabPane } = Tabs;

export const Community: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('communityPage.title')}</h1>
      <p className={styles.subtitle}>
        {t('communityPage.subtitle')}
      </p>
      <Tabs defaultActiveKey="questions" className={styles.tabs}>
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