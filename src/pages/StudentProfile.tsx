import React from 'react';
import { 
  Avatar, 
  Box, 
  Stack, 
  Typography, 
  LinearProgress, 
  Chip, 
  CircularProgress, 
  Alert as MuiAlert,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useUser } from '../UserContext';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import styles from './styles/StudentProfile.module.css';
import { Collapse } from 'antd';
import { SectionCard } from '../components/SectionCard';
import { ProfileField } from './ProfileField';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  gender: string;
  telegram: string;
  whatsapp: string;
  photo?: string;
  role?: string;
  coursesCompleted: number;
  totalCourses?: number;
  createdAt: string;
  lastLogin: string;
  birthDate?: string;
}



export const StudentProfile: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: userLoading } = useUser();
  // Удалена неиспользуемая переменная error, поскольку мы больше не делаем API-запросы
  
  // Преобразуем данные из UserContext в формат профиля
  const profile = user ? {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    country: user.country || '',
    language: user.language || '',
    gender: user.gender || '',
    telegram: user.telegram || '',
    whatsapp: user.whatsapp || '',
    photo: user.photo,
    role: user.role,
    coursesCompleted: user.coursesCompleted || 0,
    totalCourses: user.totalCourses,
    createdAt: user.createdAt || new Date().toISOString(),
    lastLogin: user.lastLogin || new Date().toISOString(),
    birthDate: user.birthDate
  } as UserProfile : null;

  if (userLoading) return <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (!profile || !user) return <MuiAlert severity="warning">{t('studentProfile.missingProfile')}</MuiAlert>;

  const achievements = [];
  if (profile.coursesCompleted >= 1) achievements.push({ name: t('studentProfile.achievementFirstSteps') });
  if (profile.coursesCompleted >= 5) achievements.push({ name: t('studentProfile.achievement5Courses') });
  if (profile.firstName && profile.lastName && profile.email && profile.phone && profile.country && profile.language && profile.gender && profile.telegram && profile.whatsapp) achievements.push({ name: t('studentProfile.achievementProfileComplete') });

  const recommendations = [];
  if (profile.coursesCompleted === 0) recommendations.push(t('studentProfile.recommendationFirstCourse'));
  if (!profile.phone || !profile.telegram || !profile.whatsapp) recommendations.push(t('studentProfile.recommendationCompleteProfile'));
  else recommendations.push(t('studentProfile.recommendationNewOpportunities'));

  const events = [
    { name: t('studentProfile.eventRegistrationDate', { date: dayjs(profile.createdAt).format('DD.MM.YYYY') }) },
    { name: t('studentProfile.eventLastLogin', { date: dayjs(profile.lastLogin).format('DD.MM.YYYY') }) },
  ];



  return (
    <Box className={styles.root}>
      <Box className={styles.profileContainer}>
        <Box className={styles.animatedBg} />
        <Avatar
          src={profile.photo}
          className={styles.avatar}
        >
          {profile.firstName?.[0] || '?'}
        </Avatar>
        <Typography variant="h3" className={styles.greeting}>
          {t('studentProfile.greeting', { name: profile.firstName })}
        </Typography>
        <Typography variant="h6" className={styles.email}>{profile.email}</Typography>
        <Chip
          label={profile.role === 'student' ? t('studentProfile.roleStudent') : profile.role}
          color="primary"
          className={styles.roleChip}
        />
      </Box>

      <Box className={styles.sectionsContainer}>
        <Collapse style={{ backgroundColor:'white' }}
          items={[
            {
              label: <Typography variant="h6" fontWeight={700}>{t('studentProfile.profileCollapseLabel')}</Typography>,
              className: "panelProfile",
              children: (
                <Box className={styles.profileFieldsContainer}>
                  <Stack spacing={2} className={styles.fieldsStack}>
                    <ProfileField label={t('studentProfile.fieldFirstName')} value={profile.firstName} />
                    <ProfileField label={t('studentProfile.fieldLastName')} value={profile.lastName} />
                    <ProfileField label={t('studentProfile.fieldEmail')} value={profile.email} />
                    <ProfileField label={t('studentProfile.fieldPhone')} value={profile.phone} />
                    <ProfileField label={t('studentProfile.fieldCountry')} value={profile.country} />
                    <ProfileField label={t('studentProfile.fieldLanguage')} value={profile.language} />
                  </Stack>
                </Box>
              ),
            },
          ]}
        />
      </Box>

      <SectionCard title={t('studentProfile.sectionAchievements')}>
        {achievements.map((achievement, index) => (
          <Chip 
            key={index} 
            label={achievement.name} 
            icon={<SchoolIcon />} 
            color="primary" 
            sx={{ mr: 1, mb: 1 }} 
          />
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>{t('studentProfile.coursesCompletedLabel')}</Typography>
          <LinearProgress variant="determinate" value={profile.coursesCompleted} sx={{ width: 100, mr: 1 }} />
          <Typography variant="body2">{profile.coursesCompleted}</Typography>
        </Box>
      </SectionCard>

      <SectionCard title={t('studentProfile.sectionRecommendations')}>
        <Stack spacing={2}>
          {recommendations.map((recommendation, index) => (
            <Typography variant="body2" key={index}>{recommendation}</Typography>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title={t('studentProfile.sectionHistory')}>
        {events.map((event, index) => (
          <Chip 
            key={index} 
            label={event.name} 
            icon={<SchoolIcon />} 
            color="primary" 
            sx={{ mr: 1, mb: 1 }} 
          />
        ))}
      </SectionCard>

    </Box>
  );
};

