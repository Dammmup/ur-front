import React, { useState, useEffect } from 'react';
import { Modal, Avatar, Spin, Typography, Space, Divider } from 'antd';
import { MailOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { FaTelegramPlane } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { getUserById } from '../api';

interface UserProfileModalProps {
  userId: string;
  visible: boolean;
  onClose: () => void;
}

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
  country?: string;
  [key: string]: any;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, visible, onClose }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && userId) {
      setLoading(true);
      setError(null);
      getUserById(userId)
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message || t('userProfile.loadingError', 'Error loading user profile'));
          setLoading(false);
        });
    }
  }, [userId, visible, t]);

  const renderUserInfo = () => {
    if (loading) return <Spin size="large" />;
    if (error) return <Typography.Text type="danger">{error}</Typography.Text>;
    if (!user) return <Typography.Text>{t('userProfile.noData', 'No user data available')}</Typography.Text>;

    return (
      <div style={{ textAlign: 'center' }}>
        <Avatar 
          src={user.photo} 
          icon={<UserOutlined />} 
          size={120} 
          style={{ marginBottom: 16 }}
        />
        
        <Typography.Title level={4} style={{ margin: '16px 0 4px' }}>
          {user.firstName} {user.lastName}
        </Typography.Title>
        
        {user.username && (
          <Typography.Text style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>
            @{user.username}
          </Typography.Text>
        )}
        
        {user.title && (
          <Typography.Text type="secondary" style={{ display: 'block', fontSize: 16 }}>
            {user.title}
          </Typography.Text>
        )}
        
        <Divider style={{ margin: '16px 0' }} />
        
        {user.description && (
          <Typography.Paragraph style={{ textAlign: 'left', marginBottom: 24 }}>
            {user.description}
          </Typography.Paragraph>
        )}
        
        <Space direction="vertical" size={12} style={{ width: '100%', textAlign: 'left' }}>
          {user.role && (
            <div>
              <Typography.Text type="secondary">{t('userProfile.role', 'Role')}: </Typography.Text>
              <Typography.Text strong>{user.role}</Typography.Text>
            </div>
          )}
          
          {user.country && (
            <div>
              <Typography.Text type="secondary">{t('userProfile.country', 'Country')}: </Typography.Text>
              <Typography.Text strong>{user.country}</Typography.Text>
            </div>
          )}
        </Space>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {user.telegram && (
            <a href={`https://t.me/${user.telegram}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
              <FaTelegramPlane style={{ marginRight: 8 }} /> {t('communityUsers.telegramLabel', 'Telegram')}
            </a>
          )}
          
          {user.whatsapp && (
            <a href={`https://wa.me/${user.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
              <WhatsAppOutlined style={{ marginRight: 8 }} /> {t('communityUsers.whatsappLabel', 'WhatsApp')}
            </a>
          )}
          
          {user.email && (
            <a href={`mailto:${user.email}`} style={{ display: 'flex', alignItems: 'center' }}>
              <MailOutlined style={{ marginRight: 8 }} /> {t('communityUsers.emailLabel', 'Email')}
            </a>
          )}
        </Space>
      </div>
    );
  };

  return (
    <Modal
      title={t('userProfile.title', 'User Profile')}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
    >
      {renderUserInfo()}
    </Modal>
  );
};

export default UserProfileModal;
