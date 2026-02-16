import React, { useState } from 'react';
import { Input, Select, InputNumber, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { LEVELS } from '../constants';
import { createCourse } from '../api';
import { useTranslation } from 'react-i18next';
import { updateCourse } from '../api';
import styles from './styles/CourseForm.module.css';

export interface CourseFormValues {
  name: string;
  level: string;
  duration: number;
  content: string;
  imageUrl?: string;
  imageLink?: string;
}


interface CourseFormProps {
  initialValues?: Partial<CourseFormValues> & { _id?: string };
  mode?: 'edit' | 'create';
  onSuccess?: (updated: any) => void;
  submitText?: string;
}


const INITIAL_STATE: CourseFormValues = {
  name: '',
  level: 'beginner',
  duration: 0.4,
  content: '',
  imageUrl: '',
  imageLink: '',
};

export const CourseForm: React.FC<CourseFormProps> = ({ initialValues, mode = 'create', onSuccess, submitText }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<CourseFormValues>(initialValues ? {
    ...INITIAL_STATE,
    ...initialValues,
    imageUrl: initialValues.imageUrl || '',
    imageLink: initialValues.imageLink || '',
  } : INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          setForm(f => ({ ...f, imageUrl: e.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Простая валидация
    if (!form.name || !form.level || !form.content || form.duration === 0) {
      message.error(t('courseForm.validationError'));
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let res;
      let updatedCourse: any = null;
      if (mode === 'edit' && initialValues && initialValues._id) {
        res = await updateCourse(initialValues._id, {
          name: form.name,
          level: form.level,
          duration: form.duration,
          content: form.content,
          image: form.imageLink || form.imageUrl,
        }, token || undefined);
        updatedCourse = { ...form, _id: initialValues._id };
      } else {
        res = await createCourse({
          name: form.name,
          level: form.level,
          duration: form.duration,
          content: form.content,
          image: form.imageLink || form.imageUrl,
        }, token || undefined);
      }
      if (res.ok || (res._id && mode === 'edit')) {
        message.success(mode === 'edit' ? t('courseForm.updateSuccess') : t('courseForm.addSuccess'));
        if (mode === 'edit' && onSuccess) onSuccess(updatedCourse);
        if (mode === 'create') setForm(INITIAL_STATE);
        if (mode === 'create' && onSuccess) onSuccess(updatedCourse);
      } else {
        const data = await res.json?.() || res;
        message.error(data.error || t('courseForm.saveError'));
      }
    } catch (e) {
      message.error(t('courseForm.networkError'));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.courseFormContainer}>
      <h2 className={styles.formTitle}>
        {mode === 'edit' ? (t('courseForm.editTitle') || 'Редактирование курса') : (t('courseForm.createTitle') || 'Создание курса')}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <Input
              placeholder={t('courseForm.namePlaceholder')}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <Select
              placeholder={t('courseForm.levelPlaceholder')}
              value={form.level}
              onChange={val => setForm(f => ({ ...f, level: val }))}
              options={LEVELS}
              className={styles.formSelect}
            />
          </div>

          <div className={styles.formGroup}>
            <InputNumber
              placeholder={t('courseForm.durationPlaceholder')}
              value={form.duration}
              onChange={val => setForm(f => ({ ...f, duration: typeof val === 'number' ? val : 0 }))}
              min={0.1}
              max={1000}
              step={0.1}
              className={styles.formInputNumber}
            />
          </div>

          <div className={styles.formGroup}>
            <Input.TextArea
              placeholder={t('courseForm.descriptionPlaceholder')}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={4}
              className={styles.formTextArea}
            />
          </div>
        </div>

        <div className={styles.imageUploadSection}>
          <div className={styles.formGroup}>
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleImageUpload}
              listType="picture-card"
              className={styles.uploadButton}
            >
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="course" style={{ width: '100%' }} />
              ) : (
                <Button icon={<UploadOutlined />}>{t('courseForm.uploadButton')}</Button>
              )}
            </Upload>
          </div>

          <div className={styles.formGroup}>
            <Input
              placeholder={t('courseForm.imageLinkPlaceholder')}
              value={form.imageLink}
              onChange={e => setForm(f => ({ ...f, imageLink: e.target.value }))}
              className={styles.formInput}
            />
          </div>

          {(form.imageLink || form.imageUrl) && (
            <div className={styles.imagePreviewContainer}>
              <div>
                <span className={styles.imagePreviewLabel}>{t('courseForm.previewLabel')}</span>
              </div>
              <img
                src={form.imageLink || form.imageUrl || ''}
                alt="preview"
                className={styles.imagePreview}
              />
            </div>
          )}
        </div>

        <Button
          type="primary"
          block
          htmlType="submit"
          loading={loading}
          className={styles.submitButton}
        >
          {submitText || (mode === 'create' ? t('courseForm.submitButtonCreate') : t('courseForm.submitButtonUpdate'))}
        </Button>
      </form>
    </div>
  );
};
