import React, { useEffect, useState } from 'react';
import { Typography, Tabs, message } from 'antd';
import styles from '../components/styles/AdminPanel.module.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import AdminEventForm from '../components/AdminEventForm';
import UserEditor from '../components/UserEditor';
import CourseForm from '../components/CourseForm';

const { Title } = Typography;

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('course');
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded || !decoded.role) {
        message.error('Ошибка авторизации: отсутствует роль пользователя.');
        navigate('/login');
        return;
      }
      setRole(decoded.role);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        message.error('Сессия истекла. Войдите снова.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
    } catch (e) {
      message.error('Ошибка авторизации. Попробуйте войти заново.');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);


  return (
    <div className={styles.adminPanelContainer}>
      <Title level={2} className={styles.centeredTitle}>Admin Panel</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'course',
            label: 'Добавить курс',
            children: (
              <CourseForm  />
            ),
          },
          {
            key: 'event',
            label: 'Добавить событие',
            children: <AdminEventForm />,
          },
          {
            key: 'user',
            label: 'Пользователи',
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

export default AdminPanel;
