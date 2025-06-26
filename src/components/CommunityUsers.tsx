import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Avatar } from 'antd';
import { MailOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { getUsers } from '../api';
import { FaTelegramPlane } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './styles/CommunityUsers.css';
import commonCardStyles from './styles/CardStyles.module.css';

interface User {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  role?: string;
  telegram?: string;
  whatsapp?: string;
  email?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

export const CommunityUsers: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(data => {
        setUsers(data.filter((u: User) => u.role !== 'admin'));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || t('communityUsers.loadingError'));
        setLoading(false);
      });
  }, [t]);


  if (loading) return <Spin size="large" className="spinner-container" />;
  if (error) return <Alert type="error" message={error} className="alert-container" />;
  if (users.length === 0) return <Alert type="info" message={t('communityUsers.noUsers')} className="alert-container" />;

  return (
    <div className={commonCardStyles.cardContainer}>
      {users.map(user => (
        <Card key={user._id} className={`user-card ${commonCardStyles.card}`}>
          <div className="user-card-content">
            <Avatar src={user.photo} icon={<UserOutlined />} size={100} className="userAvatar" />
            <div className="user-info">
              <h3 className="userName">{user.username}</h3>
              <p className="userTitle">{user.title || t('communityUsers.defaultTitle')}</p>
              <p className="userDescription">{user.description || t('communityUsers.defaultDescription')}</p>
            </div>
            {user.firstName && user.lastName && (
                <div className="user-full-name">{user.firstName} {user.lastName}</div>
                
              )}
              <div className="user-role">{user.role}</div>
              <div className="user-country">{user.country}</div>
              <div className="user-contacts" style={{ display: 'flex', flexDirection: 'column' }}>
                {user.telegram && (
                  <a href={`https://t.me/${user.telegram}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <FaTelegramPlane /> {t('communityUsers.telegramLabel')}
                  </a>
                )}
                {user.whatsapp && (
                  <a href={`https://wa.me/${user.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <WhatsAppOutlined /> {t('communityUsers.whatsappLabel')}
                  </a>
                )}
                <a href={`mailto:${user.email}`} className="contact-link">
                  <MailOutlined /> {t('communityUsers.emailLabel')}
                </a>
              </div>

          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommunityUsers;
