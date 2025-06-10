import React, { useState } from 'react';
import './styles/AdminEventForm.css';
import { createEvent, updateEvent } from '../api';
import { Upload } from 'antd';
import { useTranslation } from 'react-i18next';

const eventIcon = (
  <span className="event-icon">🎉</span>
);

interface EventRequest {
  title: string;
  description: string;
  date: string;
  location?: string;
  image?: string;
}

interface AdminEventFormProps {
  onSuccess?: () => void;
  initialValues?: {
    title: string;
    description: string;
    date: string;
    location?: string;
    image?: string;
    [key: string]: any;
  };
  onCancel?: () => void;
}

export const AdminEventForm: React.FC<AdminEventFormProps> = ({ onSuccess, initialValues, onCancel }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [date, setDate] = useState(initialValues?.date || '');
  const [location, setLocation] = useState(initialValues?.location || '');
  const [imageUrl, setImageUrl] = useState<string | null>(initialValues?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!title || !description || !date) {
      setError(t('adminEventForm.validationError'));
      return;
    }

    setLoading(true);
    const payload: EventRequest = {
      title,
      description,
      date,
      location,
      image: imageUrl || undefined,
    };
    try {
      const token = localStorage.getItem('token');
      let res, data;
      if (initialValues && initialValues._id) {
        try {
          data = await updateEvent(initialValues._id, payload, token || undefined);
          res = { ok: true };
        } catch (err: any) {
          setLoading(false);
          setError(err.message || t('adminEventForm.saveError'));
          return;
        }
      } else {
        try {
          data = await createEvent(payload, token || undefined);
          res = { ok: true };
        } catch (err: any) {
          setLoading(false);
          setError(err.message || t('adminEventForm.createError'));
          return;
        }
      }
      if (!res.ok) {
        setLoading(false);
        setError(data.error || t('adminEventForm.saveError'));
        return;
      }
      setSuccess(initialValues ? t('adminEventForm.updateSuccess') : t('adminEventForm.addSuccess'));
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setImageUrl(null);
      onSuccess?.();
    } catch {
      setError(t('adminEventForm.networkError'));
    } finally {
      setLoading(false);
    }
  };

  // Антд Upload: загрузка файла в base64
  const handleImageUpload = (info: any) => {
    const file = info.file?.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Ввод ссылки на изображение
  const setImageLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 18, boxShadow: '0 2px 20px #0001' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        {eventIcon}
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 0.5 }}>{t('adminEventForm.title')}</span>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            {t('adminEventForm.eventNameLabel')} <span style={{ color: '#f5222d' }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t('adminEventForm.eventNamePlaceholder')}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            {t('adminEventForm.descriptionLabel')} <span style={{ color: '#f5222d' }}>*</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder={t('adminEventForm.descriptionPlaceholder')}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 16, resize: 'vertical', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            {t('adminEventForm.dateTimeLabel')} <span style={{ color: '#f5222d' }}>*</span>
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>{t('adminEventForm.locationLabel')}</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder={t('adminEventForm.locationPlaceholder')}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>{t('adminEventForm.imageLabel')}</label>
          <Upload beforeUpload={() => false} maxCount={1} onChange={handleImageUpload} listType="picture-card" showUploadList={false} disabled={loading}>
            {imageUrl ? <img src={imageUrl} alt="event" style={{ width: '100%' }} /> : <button type="button" style={{ border: 'none', background: '#f5f5f5', borderRadius: 8, padding: 12, cursor: 'pointer' }}>{t('adminEventForm.uploadButton')}</button>}
          </Upload>
          <input
            type="text"
            placeholder={t('adminEventForm.imageLinkPlaceholder')}
            value={imageUrl || ''}
            onChange={setImageLink}
            style={{ width: '100%', marginTop: 8, padding: '8px 10px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 15, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            disabled={loading}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button
            type="submit"
            style={{ flex: 1, background: '#1677ff', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 7, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            disabled={loading}
          >{loading ? (initialValues ? t('adminEventForm.savingButton') : t('adminEventForm.addingButton')) : (initialValues ? t('adminEventForm.submitButtonUpdate') : t('adminEventForm.submitButtonCreate'))}</button>
          {onCancel && (
            <button
              type="button"
              style={{ flex: 1, background: '#fff', color: '#1677ff', padding: '12px 0', border: '1.5px solid #1677ff', borderRadius: 7, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
              disabled={loading}
              onClick={onCancel}
            >{t('adminEventForm.cancelButton')}</button>
          )}
        </div>
      </form>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

