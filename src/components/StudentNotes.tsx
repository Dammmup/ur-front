import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import commonStyles from './styles/CommonFormStyles.module.css';
import styles from './styles/StudentNotes.module.css';

import { updateUserNotes } from '../api';

interface StudentNotesProps {
  userId: string;
  notes: string;
  onChange?: (value: string) => void;
}


export const StudentNotes: React.FC<StudentNotesProps> = ({ userId, notes, onChange }) => {
  const { t } = useTranslation();
  const [localNotes, setLocalNotes] = useState(notes || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

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
      await updateUserNotes(userId, localNotes);
      setSuccess(t('notes.saveSuccess'));
      
    } catch (err: any) {
      setError(err.message || t('notes.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={commonStyles.formContainer}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>📝</span>
        <span className={styles.headerTitle}>{t('notes.title')}</span>
      </div>
      <form onSubmit={handleSave} autoComplete="off"
            className={commonStyles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>{t('notes.label')}</label>
          <textarea
            value={localNotes}
            onChange={handleChange}
            className={styles.textarea}
            placeholder={t('notes.placeholder')}
            rows={4}
            required
          />
        </div>
        <div className={commonStyles.actionButtons}>
          <button type="submit" className="ant-btn ant-btn-primary" disabled={loading}>{t('notes.saveButton')}</button>
        </div>
        {success && <div className={styles.success}>{success}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
};
