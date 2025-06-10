import React, { useEffect, useState } from 'react';
import { Typography, Tabs, message } from 'antd';
import styles from '../components/styles/AdminPanel.module.css';
import { jwtDecode } from 'jwt-decode';
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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    console.log(user);
    if(!user){
      navigate('/login');
      return;
    }

      if (user?.role === 'student') {
        navigate('/profile');
      } else if (user?.role !== 'admin' && user?.role !== 'teacher') {
        navigate('/');
      }
    
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded || !decoded.role) {
        message.error(t('adminPanel.authErrorNoRole'));
        navigate('/login');
        return;
      }
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        message.error(t('adminPanel.sessionExpired'));
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
    } catch (e) {
      message.error(t('adminPanel.authErrorGeneral'));
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);


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

