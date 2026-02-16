import React, { useEffect, useState } from 'react';
import { Card, Tag, Button, Spin, Alert, Modal, message, Select } from 'antd';
import { useUser } from '../UserContext';
import { getCourses, deleteCourse } from '../api';
import { CourseForm } from '../components/CourseForm';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LEVELS } from '../constants';
import './styles/Learn.css';

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced', 'speaking'] as const;
const getLevelPriority = (lvl?: string) => {
  if (!lvl) return 0;
  const idx = LEVEL_ORDER.indexOf(lvl as any);
  return idx === -1 ? 0 : idx;
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'volcano',
  speaking: 'purple',
};

interface Course {
  _id: string;
  name: string;
  image?: string;
  level?: string;
  duration?: number;
  content: string;
  price?: number;
  createdBy?: string;
  lessonId: string;
  [key: string]: any;
}

export const Learn: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const navigate = useNavigate();
  const [levelFilter, setLevelFilter] = useState<string>('');

  useEffect(() => {
    getCourses()
      .then(data => {
        setCourses(data.filter((c: Course) => c.access !== 'none'));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || t('learnPage.loadingError'));
        setLoading(false);
      });
  }, []);

  const [deleteModal, setDeleteModal] = useState<Course | null>(null);

  const handleDelete = (course: Course) => {
    Modal.confirm({
      title: t('learnPage.deleteConfirmTitle'),
      content: t('learnPage.deleteConfirmContent', { courseName: course.name }),
      okText: t('learnPage.deleteButtonOk'),
      okType: 'danger',
      cancelText: t('learnPage.cancelButton'),
      onOk: async () => {
        setLoading(true);
        try {
          await deleteCourse(course._id, localStorage.getItem('token') || undefined);
          setCourses(prev => prev.filter(c => c._id !== course._id));
          message.success(t('learnPage.deleteSuccess'));
        } catch (err: any) {
          console.error('Ошибка удаления курса:', err);
          const status = err.status ? ` (${err.status} ${err.statusText || ''})` : '';
          const body = err.body ? `: ${typeof err.body === 'string' ? err.body : (err.body?.error || JSON.stringify(err.body))}` : '';
          message.error(t('learnPage.deleteError', { status, body, message: err.message || '' }));

        } finally {
          setLoading(false);
        }
      },
    });
  };

  let visibleCourses = courses;
  // Админы и учителя видят все курсы
  if (user && (user.role === 'admin' || user.role === 'teacher')) {
    visibleCourses = courses;
  } else if (user && user.level && user.access !== false) {
    const userPriority = getLevelPriority(user.level);
    visibleCourses = courses.filter(c => getLevelPriority(c.level) <= userPriority);
  } else if (user && user.access === false) {
    visibleCourses = [];
  }
  const filteredCourses = levelFilter ? visibleCourses.filter(c => c.level === levelFilter) : visibleCourses;

  if (loading) return <Spin size="large" className="learn-loading" />;
  if (error) return <Alert type="error" message={error} style={{ margin: 40 }} />;

  return (
    <div className="learn-page">
      <div className="learn-container">
        <div className="learn-header">
          <h1>{t('learnPage.title', 'Изучайте уйгурский язык')}</h1>
          <p>{t('learnPage.subtitle', 'Выберите курс и начните обучение прямо сейчас')}</p>
        </div>

        <div className="level-filter">
          <Select
            allowClear
            placeholder={t('course.levelFilterPlaceholder')}
            style={{ width: 200 }}
            value={levelFilter || undefined}
            onChange={(val) => setLevelFilter(val as string)}
            options={LEVELS}
          />
        </div>

        {filteredCourses.length === 0 ? (
          <Alert type="info" message={t('learnPage.noCourses')} className="no-courses" />
        ) : (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <Card
                key={course._id}
                hoverable
                className="course-card"
                cover={course.image && <img alt={course.name} src={course.image} />}
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 className="course-card-title">{course.name}</h3>
                    {course.level && <Tag color={LEVEL_COLORS[course.level] || 'default'}>{course.level}</Tag>}
                  </div>
                  <div className="course-card-meta">
                    {course.duration ? ` • ${course.duration} ${t('learnPage.durationLabel')}` : ''}{course.price ? ` • ${course.price}₸` : ''}
                  </div>
                  <p className="course-card-desc">{course.content}</p>
                  {user && (user.role === 'admin' || (user.role === 'teacher' && course.createdBy === user.id)) && (
                    <div className="course-card-actions">
                      <Button type="primary" size="small" onClick={e => { e.stopPropagation(); setEditingCourse(course); }}>{t('learnPage.editButton')}</Button>
                      <Button type="default" danger size="small" onClick={e => { e.stopPropagation(); handleDelete(course); }}>{t('learnPage.deleteButton')}</Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal open={!!deleteModal} title={t('learnPage.deleteConfirmTitle')} onCancel={() => setDeleteModal(null)} footer={null} destroyOnClose>
        </Modal>

        <Modal
          open={!!editingCourse}
          title={editingCourse ? t('learnPage.editModalTitle', { courseName: editingCourse.name }) : ''}
          onCancel={() => setEditingCourse(null)}
          footer={null}
          destroyOnClose
        >
          {editingCourse && (
            <CourseForm
              key={editingCourse._id}
              initialValues={editingCourse}
              submitText={t('learnPage.saveButton')}
              onSuccess={(updated: Course) => {
                setCourses(prev => prev.map(c => c._id === updated._id ? { ...c, ...updated } : c));
                setEditingCourse(null);
                message.success(t('learnPage.updateSuccess'));
              }}
              mode="edit"
            />
          )}
        </Modal>
      </div>
    </div>
  );
};
