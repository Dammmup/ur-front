import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LessonEditor } from '../components/LessonEditor';
import './styles/LessonEditorPage.css';

const LessonEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Обработчик возврата к списку курсов
  const handleBack = () => {
    navigate('/learn');
  };

  return (
    <Container className="container">
      <Box className="header">
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
        >
          {t('common.back')}
        </Button>
        <Typography variant="h4">
          {t('lesson.editor')}
        </Typography>
      </Box>

      <LessonEditor />
    </Container>
  );
};

export default LessonEditorPage;
