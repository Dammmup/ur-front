import React, { useState } from 'react';

import { updateUserNotes } from '../api';
import { useUser } from '../UserContext';

interface StudentNotesProps {
  userId: string;
  notes: string;
  onChange?: (value: string) => void;
}


const StudentNotes: React.FC<StudentNotesProps> = ({ userId, notes, onChange }) => {
  const [localNotes, setLocalNotes] = useState(notes || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const { user } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(e.target.value);
    setSuccess(null);
    setError(null);
    if (onChange) onChange(e.target.value);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await updateUserNotes(userId, localNotes, user?.token);
      setSuccess('Заметки успешно сохранены!');
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении заметок');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="header">
        <span style={{ fontSize: 32, marginRight: 10, verticalAlign: 'middle' }}>📝</span>
        <span className="headerTitle">Примечания</span>
      </div>
      <form onSubmit={handleSave} autoComplete="off">
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Примечания</label>
          <textarea
            value={localNotes}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1.5px solid #e0e0e0', fontSize: 16, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            placeholder="Заметки преподавателя"
            rows={4}
            required
          />
        </div>
        <button type="submit" className="ant-btn ant-btn-primary" disabled={loading}>Сохранить</button>
        {success && <div style={{ color: '#389e0d', marginTop: 12, textAlign: 'center', background: '#f6ffed', borderRadius: 6, padding: '8px 0' }}>{success}</div>}
        {error && <div style={{ color: '#f5222d', marginTop: 12, textAlign: 'center', background: '#fff1f0', borderRadius: 6, padding: '8px 0' }}>{error}</div>}
      </form>
    </div>
  );
};

export default StudentNotes;
