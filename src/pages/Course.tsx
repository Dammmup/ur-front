import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateUser, getCourse, getLessons } from '../api';
import { useUser } from '../UserContext';
import { Button, Space, Modal, message, Typography } from 'antd';
import { DeleteOutlined, ToolOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './styles/Course.css';

const { Title, Paragraph } = Typography;

// ==================== Types ====================
interface Course {
  // id of the user who created the course (teacher or admin)
  createdBy?: string;
  title: string;
  _id?: string;
  name: string;
  description?: string;
  level?: string;
  duration?: number;
  price?: number;
  image?: string;
}

interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  image2?: string;
  linkonyoutube?: string;
  order?: number;
  contentBlocks?: {
    _id?: string;
    type: 'text' | 'video';
    content?: string;
    caption?: string;
    url?: string;
    order?: number;
  }[];
  /** Lesson creator id (teacher) */
  createdBy?: string;
}

// ==================== Component ====================
const CoursePage: React.FC = () => {
  const { user, setUser, token } = useUser();
  // ---------- Hooks & helpers ----------
  const { courseId } = useParams<{ courseId?: string }>();
  const navigate = useNavigate();
  const navigateToNext = (idx: number) => { navigate(`#lesson-${idx + 1}`); };
  const { t } = useTranslation();

  // ---------- Local state ----------
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';
  const isTeacherCreator = user?.role === 'teacher' && course?.createdBy === user?.id;
  const canEdit = isAdmin || isTeacherCreator;
  
  // ---------- Data loading ----------
  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    getCourse(courseId)
      .then(setCourse)
      .catch(err => setError(err.message || 'Failed to load course'))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    getLessons(courseId)
      .then(setLessons)
      .catch(err => setError(err.message || 'Failed to load lessons'));
  }, [courseId]);



  const handleDeleteLesson = async (lessonId?: string) => {
    if (!lessonId || !token) return;

    Modal.confirm({
      title: t('lesson.deleteConfirmTitle', 'Delete lesson?'),
      content: t('lesson.deleteConfirmBody', 'This action cannot be undone'),
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          // TODO: call real delete lesson API when backend ready
          message.success(t('lesson.deleted', 'Lesson deleted'));
          if (courseId) {
            const fresh = await getLessons(courseId);
            setLessons(fresh);
          }
        } catch (err: any) {
          message.error(err.message || t('common.error'));
        }
      },
    });
  };

  const handleCreateLesson = () => {
    if (!courseId) return;
    navigate(`/lesson-editor/${courseId}`);
  };

  const handleCompleteLesson = async (lessonId: string, idx: number) => {
    if (!user) return;
    // already done
    if (user.completedLessons && user.completedLessons.includes(lessonId)) {
      navigateToNext(idx);
      return;
    }
    try {
      await updateUser((user._id ?? user.id) as string, { completedLessonId: lessonId },  token as string);
      const newCompleted = [...(user.completedLessons || []), lessonId];
      setUser({ ...user, completedLessons: newCompleted, coursesCompleted: (user.coursesCompleted || 0) + 1 });
    } catch (e) {
      console.error('Failed to mark lesson completed', e);
    } finally {
      if (idx + 1 < lessons.length) {
        navigateToNext(idx);
      } else {
        message.success(t('course.finishedCourse', 'Course finished!'));
      }
    }
  };



  const renderLessonsList = () => {
    if (!lessons.length)
      return <Paragraph>{t('course.noLessons') || 'No lessons available'}</Paragraph>;

    return (
      <>
        {lessons
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((lesson, idx) => (
            <div
              key={lesson._id || idx}
              id={`lesson-${lesson._id}`}
              className="lessonItem"
            >
              <Title level={3}>{lesson.title}</Title>
              {lesson.description && <Paragraph>{lesson.description}</Paragraph>}
              {lesson.image && (
                <img className="lessonImage" src={lesson.image} alt={lesson.title} />
              )}

              {/* Content blocks */}
              {Array.isArray(lesson.contentBlocks) && lesson.contentBlocks.length > 0 && (
                <div className="lessonBlocks">
                  {lesson.contentBlocks
                    .slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((block, bIdx) => {
                      const key = block._id || bIdx;
                      if (block.type === 'video') {
                        const videoId = block.url?.split('v=')[1] || block.url;
                        return (
                          <div key={key} className="blockVideo">
                            {block.caption && <Paragraph strong>{block.caption}</Paragraph>}
                            {videoId && (
                              <iframe
                                width="100%"
                                height="480"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={block.caption || `video-${bIdx}`}
                                frameBorder={0}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            )}
                          </div>
                        );
                      }
                      return (
                        <Paragraph key={key} className="blockText">
                          {block.content}
                        </Paragraph>
                      );
                    })}
                </div>
              )}

              {/* Extra YouTube link */}
              {lesson.linkonyoutube && (
                <iframe
                  width="100%"
                  height="480"
                  src={`https://www.youtube.com/embed/${
                    lesson.linkonyoutube.split('v=')[1] || lesson.linkonyoutube
                  }`}
                  title={lesson.title}
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {lesson.image2 && (
                <img
                  className="lessonImage"
                  src={lesson.image2}
                  alt={`${lesson.title}-extra`}
                />
              )}

              {/* Footer */}
              <div className="lessonFooter">
                {user?.role === 'student' && lesson._id && (
                  <Button
                    type="primary"
                    onClick={() => handleCompleteLesson(lesson._id as string, idx)}
                  >
                    {idx + 1 === lessons.length
                      ? t('course.finishCourseButton', 'Finish course')
                      : t('course.nextLessonButton', 'Next lesson')}
                  </Button>
                )}

                {(isAdmin || isTeacherCreator) && (
                  <Space>
                    <Button
                      type="primary"
                      icon={<ToolOutlined />}
                      onClick={() => navigate(`/lesson-editor/${lesson._id}`)}
                    >
                      {t('lesson.edit') || 'Edit'}
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteLesson(lesson._id)}
                    >
                      {t('common.delete')}
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          ))}
      </>
    );
  };

  // ==================== Render ====================
  if (loading) return <div className="loading">{t('common.loading')}</div>;
  if (error) return <div className="error">{error}</div>;

  function renderCourseInfo(): React.ReactNode | Iterable<React.ReactNode> {
    if (!course) return null;
    return (
      <div className="courseInfo">
        <Title level={2}>{course.title}</Title>
        <Paragraph>{course.description}</Paragraph>
        <img src={course.image} alt={course.title} />
      </div>
    );
  }

  return (
    <div className="coursePage">
      {renderCourseInfo()}

      <div className="lessonsSection">
        <Title level={3}>{t('course.lessons') || 'Course lessons'}</Title>
        {renderLessonsList()}
      </div>

      {canEdit && (
        <div className="addLessonButton">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateLesson}>
            {t('lesson.create') || 'Create lesson'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
