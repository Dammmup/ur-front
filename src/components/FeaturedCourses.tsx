import React, { useState, useEffect } from 'react';
import { Card, Tag, Spin, Alert } from 'antd';
import { getCourses } from '../api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './styles/FeaturedCourses.css';

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
  const { t } = useTranslation();
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
        setError(e.message || t('featuredCourses.loadingError'));
        setLoading(false);
      });
  }, [t]);

  if (loading) return <Spin size="large" className="spinner-container" />;
  if (error) return <Alert type="error" message={error} className="alert-container" />;
  if (courses.length === 0) return <Alert type="info" message={t('featuredCourses.noCourses')} className="alert-container" />;

  return (
    <section className="featured-courses-section">
      <div className="featured-courses-grid">
        {courses.slice(0, 3).map(course => {
          return (
            <Card
              key={course._id}
              hoverable
              cover={course.image && <img alt={course.name} src={course.image} className="course-card-cover" />}
              style={{ borderRadius: 12 }}
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <div className="course-card-content">
                <div className="course-card-header">
                  <h3 className="course-card-title">{course.name}</h3>
                  {course.level && <Tag color="green" style={{ marginLeft: 8 }}>{course.level}</Tag>}
                </div>
                <div className="course-card-meta">
                  {t('featuredCourses.languageLabel')}: <b>{course.language}</b>{course.duration ? ` • ${course.duration} ${t('featuredCourses.durationUnit')}` : ''}{course.price ? ` • ${course.price}₸` : ''}
                </div>
                <p className="course-card-description">{course.content}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
