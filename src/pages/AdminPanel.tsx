import React, { useEffect, useState } from 'react';
import { Typography, Tabs } from 'antd';
import styles from '../components/styles/AdminPanel.module.css';
import { useNavigate } from 'react-router-dom';
import {AdminEventForm} from '../components/AdminEventForm';
import {UserEditor} from '../components/UserEditor';
import {CourseForm} from '../components/CourseForm';
import { useUser } from '../UserContext';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('course');
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    // Проверяем авторизацию пользователя и права доступа
    if (!user) {
      // Если пользователь не авторизован, редиректим на страницу входа
      navigate('/login');
      return;
    }

    // Проверка роли пользователя для доступа к админ-панели
    if (user.role === 'student') {
      // Если пользователь - студент, редиректим на его профиль
      navigate('/profile');
    } else if (user.role !== 'admin' && user.role !== 'teacher') {
      // Если у пользователя нет прав админа или учителя, редиректим на главную
      navigate('/');
    }
    // UserContext уже проверяет срок действия токена, так что дополнительные проверки не требуются
  }, [user, navigate, t]);


  return (
    <div className={styles.adminPanelContainer}>
      <Title level={2} className={styles.centeredTitle}>{t('adminPanel.title')}</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'course',
            label: t('adminPanel.addCourseTab'),
            children: (
              <CourseForm  />
            ),
          },
          {
            key: 'event',
            label: t('adminPanel.addEventTab'),
            children: <AdminEventForm />,
          },
          {
            key: 'user',
            label: t('adminPanel.usersTab'),
            children: (
              <div className={styles.userTabContent}>
                <UserEditor />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

