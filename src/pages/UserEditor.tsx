import React, { useEffect, useState } from 'react';
import '../pages/styles/UserEditor.css';
import { getUsers } from '../api';
import { ROLES, GENDERS } from '../constants';
import { Select, Spin, message } from 'antd';
import AdminUserForm from '../components/AdminUserForm';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  language: string;
  email: string;
  birthday?: string;
  gender?: string;
  telegram?: string;
  whatsapp?: string;
  role?: string;
  access?: string;
  coursesCompleted?: number;
  createdAt?: string;
  emailVerified?: boolean;
  blocked?: boolean;
  lastLogin?: string;
  notes?: string;
  photo?: string;
}

const UserEditor: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (e: any) {
        message.error(e.message || 'Ошибка сети');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      const user = users.find(u => u._id === selectedUserId) || null;
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
  }, [selectedUserId, users]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        {loading ? (
          <Spin />
        ) : (
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Выберите пользователя для редактирования"
            optionFilterProp="children"
            value={selectedUserId || undefined}
            onChange={setSelectedUserId}
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map(user => (
              <Select.Option key={user._id} value={user._id}>
                {user.lastName} {user.firstName} ({user.phone})
              </Select.Option>
            ))}
          </Select>
        )}
      </div>
      {selectedUser && <AdminUserForm key={selectedUser._id} isRegistration={false} {...selectedUser} />}
    </div>
  );
};

export default UserEditor;
