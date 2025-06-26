import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Image, Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { getLesson } from '../api';

const { Title, Paragraph } = Typography;

interface Course {
  _id: string;
  name: string;
  image: string;
  level: string;
  duration: number;
  content: string;
  price: number;
  lessonId: string; 
}

interface Lesson {
  _id: string;
  title: string;
  content: string;
  image?: string;
  linkonyoutube?: string;
  course?: Course;
}

export const CoursePage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>(); 
  const { t } = useTranslation();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!lessonId) {
        setError(t('coursePage.invalidLessonId'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const lessonData = await getLesson(lessonId);
        setLesson(lessonData);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(t('coursePage.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId, t]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 40 }} />;
  if (!lesson) return <Alert type="info" message={t('coursePage.lessonNotFound')} style={{ margin: 40 }} />;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>{lesson.title}</Title>
        
        {lesson.course && (
          <Paragraph type="secondary">
            {t('coursePage.courseLabel')}: {lesson.course.name}
          </Paragraph>
        )}

        {lesson.image && (
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Image
              src={lesson.image}
              alt={lesson.title}
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </div>
        )}

        {lesson.linkonyoutube && (
          <div style={{ margin: '24px 0' }}>
            <Title level={4}>{t('coursePage.videoLabel')}</Title>
           
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <Title level={4}>{t('coursePage.contentLabel')}</Title>
          <div 
            dangerouslySetInnerHTML={{ __html: lesson.content }}
            style={{ lineHeight: 1.6 }}
          />
        </div>
      </Card>
    </div>
  );
};
