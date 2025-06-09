import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Tag } from 'antd';
import { getUsers } from '../api';

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

const CommunityUsers: React.FC = () => {
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
        setError(e.message || 'Ошибка загрузки пользователей');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 40 }} />;
  if (users.length === 0) return <Alert type="info" message="Нет пользователей" style={{ margin: 40 }} />;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
      {users.map(user => (
        <Card key={user._id} hoverable style={{ borderRadius: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 18 }}>{user.username || user.firstName || 'User'}</span>
              {user.role && <Tag color={user.role === 'teacher' ? 'blue' : 'default'}>{user.role}</Tag>}
            </div>
            {user.firstName && user.lastName && (
              <div style={{ color: '#888', fontSize: 14 }}>{user.firstName} {user.lastName}</div>
            )}
            <div><img src={user.photo}></img></div>
            <div style={{ marginTop: 8 }}>
              {user.telegram && <div>Telegram: <a href={`https://t.me/${user.telegram.replace('@','')}`} target="_blank" rel="noopener noreferrer">{user.telegram}</a></div>}
              {user.whatsapp && <div>WhatsApp: <a href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{user.whatsapp}</a></div>}
              {user.email && <div>Email: <a href={`mailto:${user.email}`}>{user.email}</a></div>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommunityUsers;
