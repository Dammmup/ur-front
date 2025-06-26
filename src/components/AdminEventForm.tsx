import React, { useState } from 'react';
import './styles/AdminEventForm.css';
import { Form, Input, DatePicker, Upload, Button, Spin, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import type { UploadChangeParam } from 'antd/es/upload';
import commonStyles from './styles/CommonFormStyles.module.css';
import { createEvent, updateEvent } from '../api';
import { useTranslation } from 'react-i18next';

interface EventRequest {
  title: string;
  description: string;
  date: string; // ISO string
  location?: string;
  image?: string;
}

interface AdminEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: Partial<EventRequest> & { _id?: string };
}

export const AdminEventForm: React.FC<AdminEventFormProps> = ({ onSuccess, onCancel, initialValues }) => {
  const { t } = useTranslation();

  const [imageUrl, setImageUrl] = useState<string | undefined>(initialValues?.image);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImageUpload = (info: UploadChangeParam) => {
    const file = info.file.originFileObj;
    if (!file) return false;
    const reader = new FileReader();
    reader.onload = e => setImageUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    return false; // prevent auto upload
  };

  const handleSubmit = async (values: any) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const payload: EventRequest = {
        title: values.title,
        description: values.description,
        date: (values.date as dayjs.Dayjs).toISOString(),
        location: values.location,
        image: imageUrl,
      };
      const token = localStorage.getItem('token') || undefined;
      if (initialValues?._id) {
        await updateEvent(initialValues._id, payload, token);
        const msg = t('adminEventForm.updateSuccess');
        setSuccess(msg);
        message.success(msg);
      } else {
        await createEvent(payload, token);
        const msg = t('adminEventForm.addSuccess');
        setSuccess(msg);
        message.success(msg);
      }
      onSuccess?.();
    } catch (e: any) {
      const errMsg = e?.message || t('adminEventForm.saveError');
      setError(errMsg);
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={commonStyles.formContainer}>
      <h1>{initialValues ? t('adminEventForm.editEvent') : t('adminEventForm.addEvent')}</h1>

      {loading && <Spin style={{ marginBottom: 16 }} />}

      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          title: initialValues?.title,
          description: initialValues?.description,
          date: initialValues?.date ? dayjs(initialValues.date) : undefined,
          location: initialValues?.location,
        }}
        className={commonStyles.form}
      >
        <Form.Item
          label={t('adminEventForm.eventNameLabel')}
          name="title"
          rules={[{ required: true, message: t('adminEventForm.validationError') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('adminEventForm.descriptionLabel')}
          name="description"
          rules={[{ required: true, message: t('adminEventForm.validationError') }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label={t('adminEventForm.dateTimeLabel')}
          name="date"
          rules={[{ required: true, message: t('adminEventForm.validationError') }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label={t('adminEventForm.locationLabel')} name="location">
          <Input />
        </Form.Item>

        <Form.Item label={t('adminEventForm.imageLabel')} valuePropName="fileList" getValueFromEvent={() => imageUrl}>
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture-card"
            showUploadList={false}
            onChange={handleImageUpload}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="event" style={{ width: '100%' }} />
            ) : (
              <div style={{ background: '#fafafa', padding: 12 }}>{t('adminEventForm.uploadButton')}</div>
            )}
          </Upload>
          <Input
            placeholder={t('adminEventForm.imageLinkPlaceholder')}
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            style={{ marginTop: 8 }}
          />
        </Form.Item>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <Form.Item className={commonStyles.actionButtons} style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 12 }} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('common.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

