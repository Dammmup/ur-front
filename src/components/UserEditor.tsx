import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../pages/styles/UserEditor.css';
import { getUsers } from '../api.ts';
import { Select, Spin, message } from 'antd';
import { UserForm } from './UserForm.tsx';
import { StudentNotes } from './StudentNotes';
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
  access?: boolean;
  coursesCompleted?: number;
  createdAt?: string;
  emailVerified?: boolean;
  blocked?: boolean;
  lastLogin?: string;
  notes?: string;
  photo?: string;
  level?: string;
  active?: string;
}

export const UserEditor: React.FC = () => {
  const { t } = useTranslation();
  const { user: contextUser } = useUser();
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

  // Функция для преобразования active в строку для UserForm
  const getActiveString = (activeVal: string | boolean | undefined): string | undefined => {
    if (activeVal === undefined) return undefined;
    return String(activeVal);
  };

  return (
    <div>
      {/* Админ видит селектор и может редактировать любого */}
      {contextUser?.role === 'admin' && (
        <>
          <div style={{ marginBottom: 24 }}>
            {loading ? (
              <Spin />
            ) : (
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder={t('userEditor.selectUserPlaceholderAdmin')}
                optionFilterProp="children"
                value={selectedUserId || undefined}
                onChange={setSelectedUserId}
                filterOption={(input, option) =>
                  (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {users.map(u => (
                  <Select.Option key={u._id} value={u._id}>
                    {u.lastName} {u.firstName} ({u.role}) – {u.level || '—'}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
          {selectedUser && (
            <UserForm
              login={selectedUser.login}
              firstName={selectedUser.firstName}
              lastName={selectedUser.lastName}
              phone={selectedUser.phone}
              country={selectedUser.country}
              language={selectedUser.language}
              email={selectedUser.email}
              birthday={selectedUser.birthday}
              gender={selectedUser.gender}
              telegram={selectedUser.telegram}
              whatsapp={selectedUser.whatsapp}
              role={selectedUser.role}
              access={selectedUser.access}
              coursesCompleted={selectedUser.coursesCompleted}
              createdAt={selectedUser.createdAt}
              emailVerified={selectedUser.emailVerified}
              blocked={selectedUser.blocked}
              lastLogin={selectedUser.lastLogin}
              notes={selectedUser.notes}
              photo={selectedUser.photo}
              active={selectedUser.active !== undefined ? String(selectedUser.active) : undefined}
              currentUserRole={contextUser.role}
            />
          )}
        </>
      )}

      {/* Преподаватель видит селектор студентов и либо свой профиль, либо заметки студента */}
      {contextUser?.role === 'teacher' && (
        <>
          <div style={{ marginBottom: 24 }}>
            {loading ? (
              <Spin />
            ) : (
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder={t('userEditor.selectUserPlaceholderTeacher')}
                optionFilterProp="children"
                value={selectedUserId || undefined}
                onChange={setSelectedUserId}
                allowClear
                filterOption={(input, option) =>
                  (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {users.filter(u => u.role === 'student').map(student => (
                  <Select.Option key={student._id} value={student._id}>
                    {student.lastName} {student.firstName} ({student.phone}) – {student.level || '—'}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>

          {selectedUser && selectedUser.role === 'student' ? (
            <StudentNotes
              userId={selectedUser._id}
              notes={selectedUser.notes || ''}
            />
          ) : (
            <UserForm
              _id={contextUser._id}
              email={contextUser.email}
              username={contextUser.username}
              firstName={contextUser.firstName}
              lastName={contextUser.lastName}
              phone={contextUser.phone}
              country={contextUser.country}
              language={contextUser.language}
              gender={contextUser.gender}
              telegram={contextUser.telegram}
              whatsapp={contextUser.whatsapp}
              role={contextUser.role}
              access={contextUser.access}
              coursesCompleted={contextUser.coursesCompleted}
              createdAt={contextUser.createdAt}
              emailVerified={contextUser.emailVerified}
              photo={contextUser.photo}
              active={getActiveString(contextUser.active)}
              currentUserRole={contextUser.role}
              isReadOnly={true}
            />
          )}
        </>
      )}

      {/* Студент видит только свой профиль */}
      {contextUser?.role === 'student' && (
        <UserForm
          _id={contextUser._id}
          email={contextUser.username}
          firstName={contextUser.firstName}
          lastName={contextUser.lastName}
          phone={contextUser.phone}
          country={contextUser.country}
          language={contextUser.language}
          gender={contextUser.gender}
          telegram={contextUser.telegram}
          whatsapp={contextUser.whatsapp}
          role={contextUser.role}
          access={contextUser.access}
          coursesCompleted={contextUser.coursesCompleted}
          createdAt={contextUser.createdAt}
          emailVerified={contextUser.emailVerified}
          photo={contextUser.photo}
          active={getActiveString(contextUser.active)}
          currentUserRole={contextUser.role}
        />
      )}
    </div>
  );
};
