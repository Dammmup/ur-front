import React, { useState } from 'react';
import { Input, Select, InputNumber, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { LEVELS } from '../constants';
import { createCourse } from '../api';
import { useTranslation } from 'react-i18next';
import { updateCourse } from '../api';

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
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      const reader = new FileReader();
      reader.onload = e => setForm(f => ({ ...f, imageUrl: e.target?.result as string }));
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Простая валидация
    if (!form.name || !form.level || !form.content || form.duration === 0 ) {
      message.error(t('courseForm.validationError'));
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let res;
      let updatedCourse = null;
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        placeholder={t('courseForm.namePlaceholder')}
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
      />
      <Select
        placeholder={t('courseForm.levelPlaceholder')}
        value={form.level}
        onChange={val => setForm(f => ({ ...f, level: val }))}
        options={LEVELS}
      />
      <InputNumber
        placeholder={t('courseForm.durationPlaceholder')}
        value={form.duration}
        onChange={val => setForm(f => ({ ...f, duration: typeof val === 'number' ? val : 0 }))}
        min={0.1}
        max={1000}
        step={0.1}
        style={{ width: '100%' }}
      />
      <Input.TextArea
        placeholder={t('courseForm.descriptionPlaceholder')}
        value={form.content}
        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
        rows={4}
      />
     
      <Upload beforeUpload={() => false} maxCount={1} onChange={handleImageUpload} listType="picture-card">
        {form.imageUrl ? <img src={form.imageUrl} alt="course" style={{ width: '100%' }} /> : <Button icon={<UploadOutlined />}>{t('courseForm.uploadButton')}</Button>}
      </Upload>
      <Input
        placeholder={t('courseForm.imageLinkPlaceholder')}
        value={form.imageLink}
        onChange={e => setForm(f => ({ ...f, imageLink: e.target.value }))}
      />
      {(form.imageLink || form.imageUrl) && (
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#888' }}>{t('courseForm.previewLabel')}</span><br />
          <img src={form.imageLink || form.imageUrl || ''} alt="preview" style={{ width: 120, borderRadius: 8, marginTop: 4 }} />
        </div>
      )}
      <Button type="primary" block htmlType="submit" loading={loading}>{submitText || (mode === 'create' ? t('courseForm.submitButtonCreate') : t('courseForm.submitButtonUpdate'))}</Button>
    </form>
  );
};
