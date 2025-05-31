import React, { useState } from 'react';
import './styles/AdminEventForm.css';
import { createEvent } from '../api';

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

const AdminEventForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!title || !description || !date) {
      setError('Пожалуйста, заполните обязательные поля!');
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
      const res = await createEvent(payload, token || undefined);
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setError(data.error || 'Ошибка при создании события');
        return;
      }
      setSuccess('Событие добавлено!');
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setImageUrl(null);
      onSuccess?.();
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = evt => setImageUrl(evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 18, boxShadow: '0 2px 20px #0001' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        {eventIcon}
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 0.5 }}>Добавить новое событие</span>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Название события <span style={{ color: '#f5222d' }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Например, Вечер поэзии"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Описание <span style={{ color: '#f5222d' }}>*</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="Краткое описание мероприятия..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 16, resize: 'vertical', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Дата и время <span style={{ color: '#f5222d' }}>*</span>
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
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Место</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Адрес или онлайн-ссылка (необязательно)"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Изображение (необязательно)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: 8 }}
            disabled={loading}
          />
          {imageUrl && (
            <div style={{ marginTop: 8, marginBottom: 0 }}>
              <img src={imageUrl} alt="event" style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 10, border: '1px solid #eee', boxShadow: '0 2px 8px #0001' }} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button
            type="submit"
            style={{ flex: 1, background: '#1677ff', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 7, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            disabled={loading}
          >{loading ? 'Добавление...' : 'Добавить событие'}</button>
          <button
            type="button"
            onClick={() => { setTitle(''); setDescription(''); setDate(''); setLocation(''); setImageUrl(null); setError(null); setSuccess(null); }}
            style={{ flex: '0 0 50px', background: '#fff', color: '#1677ff', border: '1.5px solid #1677ff', borderRadius: 7, fontWeight: 500, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            disabled={loading}
            title="Очистить форму"
          >✕</button>
        </div>
        {error && <div style={{ color: '#f5222d', marginTop: 18, textAlign: 'center', fontSize: 15, fontWeight: 500, background: '#fff1f0', borderRadius: 6, padding: '8px 0' }}>{error}</div>}
        {success && <div style={{ color: '#389e0d', marginTop: 18, textAlign: 'center', fontSize: 15, fontWeight: 500, background: '#f6ffed', borderRadius: 6, padding: '8px 0' }}>{success}</div>}
      </form>
    </div>
  );
};

export default AdminEventForm;
