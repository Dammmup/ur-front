import React, { useState, useEffect } from 'react';
import { Card, Tag, Spin, Alert } from 'antd';
import { getCourses } from '../api';
import { useNavigate } from 'react-router-dom';
interface Course {
  _id: string;
  name: string;
  language: string;
  image?: string;
  level?: string;
  duration?: number;
  content: string;
  price?: number;
  // дополнительные поля, если появятся
  [key: string]: any;
}


export const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Логируем user при каждом рендере


  useEffect(() => {
    getCourses()
      .then(data => {
        // Фильтруем курсы с access !== 'none'
        setCourses(data.filter((c: Course) => c.access !== 'none'));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || 'Ошибка загрузки курсов');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 40 }} />;
  if (courses.length === 0) return <Alert type="info" message="Нет доступных курсов" style={{ margin: 40 }} />;

  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
        {courses.slice(0, 3).map(course => {
          return (
            <Card
              key={course._id}
              hoverable
              cover={course.image && <img alt={course.name} src={course.image} style={{ height: 192, objectFit: 'cover' }} />}
              style={{ borderRadius: 12 }}
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{course.name}</h3>
                  {course.level && <Tag color="green" style={{ marginLeft: 8 }}>{course.level}</Tag>}
                </div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>
                  Язык: <b>{course.language}</b>{course.duration ? ` • ${course.duration} ч.` : ''}{course.price ? ` • ${course.price}₸` : ''}
                </div>
                <p style={{ color: '#555', marginBottom: 8 }}>{course.content}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
