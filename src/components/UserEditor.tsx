import React, { useEffect, useState } from 'react';
import '../pages/styles/UserEditor.css';
import { getUsers } from '../api.ts';
import { Select, Spin, message } from 'antd';
import UserForm from './UserForm.tsx';
import StudentNotes from './StudentNotes';
import { useUser } from '../UserContext';

interface User {
  _id: string;
  login: string;
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
  const { user } = useUser();
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
      {/* Только админ видит селектор и может редактировать любого */}
      {user?.role === 'admin' && (
        <>
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
          {selectedUser && (
            <UserForm {...selectedUser} currentUserRole={user.role} />
          )}
        </>
      )}

      {/* Преподаватель и студент видят только свой профиль */}
      {(user?.role === 'teacher' || user?.role === 'student') && (
        <UserForm {...user} currentUserRole={user.role} />
      )}

      {/* teacher может видеть заметки выбранного ученика */}
      {user?.role === 'teacher' && selectedUser && selectedUser.role === 'student' && (
        <StudentNotes
          userId={selectedUser._id}
          notes={selectedUser.notes || ''}
        />
      )}
      
    </div>
  );
};

export default UserEditor;
