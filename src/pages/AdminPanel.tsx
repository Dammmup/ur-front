import React, { useEffect, useState } from 'react';
import {  Input, Button, Select, InputNumber, Upload, message, Typography, Tabs } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import AdminEventForm from '../components/AdminEventForm';
import UserEditor from './UserEditor';

const { Title } = Typography;

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const languages = [
  { value: 'ug', label: 'Uyghur' },
  { value: 'ru', label: 'Russian' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'sv', label: 'Swedish' },
  { value: 'kk', label: 'Kazakh' },
  { value: 'tr', label: 'Turkish' },
];



const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('course');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  // Удаляем все Form/useForm для курса, оставляем только для событий
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState<string>('');

  // Состояния для каждого поля курса
  const [courseName, setCourseName] = useState('');
  const [courseLanguage, setCourseLanguage] = useState<string | undefined>(undefined);
  const [courseLevel, setCourseLevel] = useState<string | undefined>(undefined);
  const [courseDuration, setCourseDuration] = useState<number | null>(null);
  const [courseContent, setCourseContent] = useState('');
  const [coursePrice, setCoursePrice] = useState<number | null>(null);

  // Функция отправки
  const handleAddCourse = async () => {
    // Простая валидация
    if (!courseName || !courseLanguage || !courseLevel || courseDuration === null || !courseContent || coursePrice === null) {
      message.error('Пожалуйста, заполните все поля!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          name: courseName,
          language: courseLanguage,
          level: courseLevel,
          duration: courseDuration,
          content: courseContent,
          price: coursePrice,
          image: imageLink || imageUrl || '',
        }),
      });
      if (res.ok) {
        message.success('Курс добавлен!');
        setCourseName('');
        setCourseLanguage(undefined);
        setCourseLevel(undefined);
        setCourseDuration(null);
        setCourseContent('');
        setCoursePrice(null);
        setImageUrl(null);
        setImageLink('');
      } else {
        const data = await res.json();
        message.error(data.error || 'Ошибка при добавлении курса');
      }
    } catch (e) {
      message.error('Ошибка сети');
    }
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/courses')
      .then(res => res.json())
      .then(data => console.log('Backend response:', data))
      .catch(err => console.error('Ошибка связи с бэкендом:', err));
  }, []);
  const handleImageUpload = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      // For demo: convert file to base64
      const reader = new FileReader();
      reader.onload = e => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '48px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px #0001' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Admin Panel</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'course',
            label: 'Добавить курс',
            children: (
              <div style={{ padding: 12 }}>
                <h3 style={{ marginBottom: 16 }}>Добавить курс</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Input
                    placeholder="Название курса"
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                  />
                  <Select
                    placeholder="Язык"
                    value={courseLanguage}
                    onChange={setCourseLanguage}
                    options={languages}
                  />
                  <Select
                    placeholder="Уровень"
                    value={courseLevel}
                    onChange={setCourseLevel}
                    options={levels}
                  />
                  <InputNumber
                    placeholder="Длительность (часы)"
                    value={courseDuration}
                    onChange={setCourseDuration}
                    min={1}
                    max={1000}
                    style={{ width: '100%' }}
                  />
                  <Input.TextArea
                    placeholder="Описание"
                    value={courseContent}
                    onChange={e => setCourseContent(e.target.value)}
                    rows={4}
                  />
                  <InputNumber
                    placeholder="Цена ($)"
                    value={coursePrice}
                    onChange={setCoursePrice}
                    min={0}
                    max={10000}
                    style={{ width: '100%' }}
                  />
                  <Upload beforeUpload={() => false} maxCount={1} onChange={handleImageUpload} listType="picture-card">
                    {imageUrl ? <img src={imageUrl} alt="course" style={{ width: '100%' }} /> : <Button icon={<UploadOutlined />}>Загрузить</Button>}
                  </Upload>
                  <Input
                    placeholder="или вставьте ссылку на изображение"
                    value={imageLink}
                    onChange={e => setImageLink(e.target.value)}
                  />
                  {(imageLink || imageUrl) && (
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: 13, color: '#888' }}>Превью:</span><br />
                      <img src={imageLink || imageUrl || ''} alt="preview" style={{ width: 120, borderRadius: 8, marginTop: 4 }} />
                    </div>
                  )}
                  <Button type="primary" block onClick={handleAddCourse}>Добавить курс</Button>
                </div>
              </div>
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
              <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <UserEditor />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AdminPanel;
