import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Avatar } from 'antd';
import { UserOutlined, WhatsAppOutlined, MailOutlined } from '@ant-design/icons';
import { FaTelegramPlane } from 'react-icons/fa';
import { getUsers } from '../api';
import { useTranslation } from 'react-i18next';
import './styles/CommunityUsers.css';

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
    <div className="community-users-container">
      {users.map(user => (
        <Card key={user._id} className="user-card">
          <div className="user-card-content">
            <Avatar src={user.photo} icon={<UserOutlined />} size={100} />
            <div className="user-info">
              <h3 className="user-name">{user.username || user.firstName || t('communityUsers.defaultUserName')}</h3>
              {user.firstName && user.lastName && (
                <div className="user-full-name">{user.firstName} {user.lastName}</div>
                
              )}
              <div className="user-role">{user.role}</div>
              <div className="user-country">{user.country}</div>
              <div className="user-contacts">
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
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommunityUsers;
