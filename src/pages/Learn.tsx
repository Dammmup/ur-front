import React, { useEffect, useState } from 'react';
import { Card, Tag, Button, Spin, Alert, Modal, message, Select } from 'antd';
import { useUser } from '../UserContext';
import { getCourses, deleteCourse } from '../api';
import {CourseForm} from '../components/CourseForm';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LEVELS } from '../constants';

interface Course {
  _id: string;
  name: string;
  language: string;
  image?: string;
  level?: string;
  duration?: number;
  content: string;
  price?: number;
  createdBy?: string;
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

  const filteredCourses = levelFilter ? courses.filter(c => c.level === levelFilter) : courses;

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 40 }} />;

  return (
    <div style={{ padding: '48px 0', textAlign: 'center' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', marginBottom: 24 }}>
        <Select
          allowClear
          placeholder={t('learnPage.levelFilterPlaceholder')}
          style={{ width: 200, marginBottom: 24 }}
          value={levelFilter || undefined}
          onChange={val => setLevelFilter(val)}
          options={LEVELS.map(l => ({ value: l.value ?? l, label: l.label ?? l }))}
        />
      </div>
{filteredCourses.length === 0 ? <Alert type="info" message={t('learnPage.noCourses')} style={{ margin: 40 }} /> : ( 
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
        {filteredCourses.map(course => (
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
                {t('learnPage.languageLabel')}: <b>{course.language}</b>{course.duration ? ` • ${course.duration} ${t('learnPage.durationLabel')}` : ''}{course.price ? ` • ${course.price}₸` : ''}
              </div>
              <p style={{ color: '#555', marginBottom: 8 }}>{course.content}</p>
              {user && (user.role === 'admin' || (user.role === 'teacher' && course.createdBy === user.id)) && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button type="primary" size="small" onClick={e => { e.stopPropagation(); setEditingCourse(course); }}>{t('learnPage.editButton')}</Button>
                  <Button type="default" danger size="small" onClick={e => { e.stopPropagation(); handleDelete(course); }}>{t('learnPage.deleteButton')}</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>)}
      <Modal open={!!deleteModal} title={t('learnPage.deleteConfirmTitle')} onCancel={() => setDeleteModal(null)} footer={null}>
        
      </Modal>
      <Modal
        open={!!editingCourse}
        title={editingCourse ? t('learnPage.editModalTitle', { courseName: editingCourse.name }) : ''}
        onCancel={() => setEditingCourse(null)}
        footer={null}
        destroyOnHidden
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
    )}

