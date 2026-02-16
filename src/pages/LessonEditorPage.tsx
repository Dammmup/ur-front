import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LessonEditor } from '../components/LessonEditor';
import './styles/LessonEditorPage.css';

const LessonEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate('/learn');
  };

  return (
    <div className="lesson-editor-page">
      <div className="lesson-editor-container">
        <div className="lesson-editor-header">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="back-button"
          >
            {t('common.back')}
          </Button>
          <Typography variant="h4" component="h1">
            {t('lesson.editor')}
          </Typography>
        </div>

        <LessonEditor />
      </div>
    </div>
  );
};

export default LessonEditorPage;
