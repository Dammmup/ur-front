import React, { useEffect, useState } from 'react';
import { Card, Tag, Button, Spin, Alert, Modal, message } from 'antd';
import { useUser } from '../UserContext';
import { getCourses, deleteCourse } from '../api';
import CourseForm from '../components/CourseForm';
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
  createdBy?: string;
  [key: string]: any;
}

const Learn: React.FC = () => {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses()
      .then(data => {
        setCourses(data.filter((c: Course) => c.access !== 'none'));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || 'Ошибка загрузки курсов');
        setLoading(false);
      });
  }, []);

  const [deleteModal, setDeleteModal] = useState<Course | null>(null);

  const handleDelete = (course: Course) => {
    Modal.confirm({
      title: 'Удалить курс?',
      content: `Вы уверены, что хотите удалить курс "${course.name}"? Это действие необратимо.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        setLoading(true);
        try {
          await deleteCourse(course._id, localStorage.getItem('token') || undefined);
          setCourses(prev => prev.filter(c => c._id !== course._id));
          message.success('Курс удалён');
        } catch (err: any) {
          console.error('Ошибка удаления курса:', err);
          const status = err.status ? ` (${err.status} ${err.statusText || ''})` : '';
          const body = err.body ? `: ${typeof err.body === 'string' ? err.body : (err.body?.error || JSON.stringify(err.body))}` : '';
          message.error(`Ошибка удаления${status}${body} — ${err.message || ''}`);

        } finally {
          setLoading(false);
        }
      },
    });
  };


  if (loading) return <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 40 }} />;
  if (courses.length === 0) return <Alert type="info" message="Нет доступных курсов" style={{ margin: 40 }} />;

  return (
    <div style={{ padding: '48px 0', textAlign: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
        {courses.map(course => (
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
              {user && (user.role === 'admin' || (user.role === 'teacher' && course.createdBy === user.id)) && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button type="primary" size="small" onClick={e => { e.stopPropagation(); setEditingCourse(course); }}>Редактировать</Button>
                  <Button type="default" danger size="small" onClick={e => { e.stopPropagation(); handleDelete(course); }}>Удалить</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Modal open={!!deleteModal} title="Удалить курс?" onCancel={() => setDeleteModal(null)} footer={null}>
        
      </Modal>
      <Modal
        open={!!editingCourse}
        title={editingCourse ? `Редактировать курс: ${editingCourse.name}` : ''}
        onCancel={() => setEditingCourse(null)}
        footer={null}
        destroyOnHidden
      >
        {editingCourse && (
          <CourseForm
            key={editingCourse._id}
            initialValues={editingCourse}
            submitText="Сохранить"
            onSuccess={(updated: Course) => {
              setCourses(prev => prev.map(c => c._id === updated._id ? { ...c, ...updated } : c));
              setEditingCourse(null);
              message.success('Курс обновлён');
            }}
            mode="edit"
          />
        )}
      </Modal>
    </div>
  );
};

export default Learn;
