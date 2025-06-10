import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Alert, Tag, message } from 'antd';
import { getCourseById, updateCourse, deleteCourse } from '../api';
import { Modal, Button } from 'antd';
import { useUser } from '../UserContext';
import { useTranslation } from 'react-i18next';
// import AdminCourseForm from '../components/AdminCourseForm'; // Раскомментируйте если форма есть

interface Course {
  _id: string;
  name: string;
  language: string;
  image?: string;
  level?: string;
  duration?: number;
  content: string;
  price?: number;
  [key: string]: any;
}

export const CoursePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editValues, setEditValues] = useState<Course | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCourseById(id)
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || t('coursePage.loadingError'));
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 40 }} />;
  if (!course) return <Alert type="info" message={t('coursePage.notFound')} style={{ margin: 40 }} />;

  return (
    <Card
      title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {course.name}
        {course.level && <Tag color="green">{course.level}</Tag>}
        {user && (user.role === 'admin' || user.role === 'teacher') && (
          <>
            <Button type="default" size="small" style={{ marginLeft: 16 }} onClick={() => { setEditDialogOpen(true); setEditValues(course); }}>{t('coursePage.editButton')}</Button>
            <Button type="default" danger size="small" style={{ marginLeft: 8 }} onClick={async () => {
              if (window.confirm(t('coursePage.deleteConfirmation'))) {
                setDeleteLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  await deleteCourse(course._id, token || undefined);
                  message.success(t('coursePage.deleteSuccess'));
                  navigate('/courses');
                } catch (e: any) {
                  message.error(e.message || t('coursePage.deleteError'));
                } finally {
                  setDeleteLoading(false);
                }
              }
            }} disabled={deleteLoading}>{t('coursePage.deleteButton')}</Button>
          </>
        )}
      </div>}
      style={{ maxWidth: 700, margin: '40px auto', borderRadius: 12 }}
      cover={course.image && <img alt={course.name} src={course.image} style={{ height: 260, objectFit: 'cover' }} />}
    >
      <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
        {t('coursePage.languageLabel')}: <b>{course.language}</b>{course.duration ? ` • ${course.duration} ${t('coursePage.durationLabel')}` : ''}{course.price ? ` • ${course.price}₸` : ''}
      </div>
      <div style={{ color: '#555', marginBottom: 16 }}>{course.content}</div>
      {/* Здесь можно добавить список уроков, материалов, кнопки записи и т.д. */}

      {/* Modal для редактирования курса */}
      <Modal
        open={editDialogOpen}
        onCancel={() => setEditDialogOpen(false)}
        title={t('coursePage.editModalTitle')}
        footer={null}
        destroyOnHidden
      >
        {/* Если есть AdminCourseForm, используйте его здесь */}
        {/* <AdminCourseForm initialValues={editValues} onSuccess={...} onCancel={...} /> */}
        {/* Временная форма для примера: */}
        {editValues && (
          <form onSubmit={async e => {
            e.preventDefault();
            try {
              const token = localStorage.getItem('token');
              await updateCourse(editValues._id, editValues, token || undefined);
              message.success(t('coursePage.updateSuccess'));
              setEditDialogOpen(false);
              getCourseById(editValues._id).then(setCourse);
            } catch (err: any) {
              message.error(err.message || t('coursePage.updateError'));
            }
          }}>
            <div style={{ marginBottom: 12 }}>
              <input type="text" value={editValues.name} onChange={e => setEditValues({ ...editValues, name: e.target.value })} placeholder={t('coursePage.namePlaceholder')} style={{ width: '100%', padding: 8, fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input type="text" value={editValues.language} onChange={e => setEditValues({ ...editValues, language: e.target.value })} placeholder={t('coursePage.languagePlaceholder')} style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <textarea value={editValues.content} onChange={e => setEditValues({ ...editValues, content: e.target.value })} placeholder={t('coursePage.descriptionPlaceholder')} style={{ width: '100%', padding: 8, minHeight: 80 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setEditDialogOpen(false)}>
                {t('coursePage.cancelButton')}
              </Button>
              <Button type="primary" htmlType="submit">
                {t('coursePage.saveButton')}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </Card>
  );
};

