import React from 'react';
import { 
  Avatar, 
  Box, 
  CardContent, 
  Stack, 
  Typography, 
  LinearProgress, 
  Chip, 
  CircularProgress, 
  Alert as MuiAlert,
  TextField,
  FormControl,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useUser } from '../UserContext';
import { fetchUserById } from '../api';
import dayjs from 'dayjs';
import './styles/StudentProfile.css';
import { Collapse } from 'antd';
import SectionCard from './SectionCard';
import ProfileField from './ProfileField';

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

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  gender: string;
  telegram: string;
  whatsapp: string;
}

interface ProfileFormErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  gender: string;
  telegram: string;
  whatsapp: string;
}

const StudentProfile: React.FC = () => {
  const { user } = useUser();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [formValues, setFormValues] = React.useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    language: '',
    gender: '',
    telegram: '',
    whatsapp: '',
  });
  const [formErrors, setFormErrors] = React.useState<ProfileFormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    language: '',
    gender: '',
    telegram: '',
    whatsapp: '',
  });




  React.useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetchUserById(user.id, localStorage.getItem('token') || undefined)
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || 'Ошибка профиля');
        setLoading(false);
      });
  }, [user]);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <MuiAlert severity="error">{error}</MuiAlert>;
  if (!profile) return null;

  const achievements = [];
  if (profile.coursesCompleted >= 1) achievements.push({ name: 'Первые шаги' });
  if (profile.coursesCompleted >= 5) achievements.push({ name: '5 курсов' });
  if (profile.firstName && profile.lastName && profile.email && profile.phone && profile.country && profile.language && profile.gender && profile.telegram && profile.whatsapp) achievements.push({ name: 'Профиль заполнен' });

  const recommendations = [];
  if (profile.coursesCompleted === 0) recommendations.push('Пройдите первый курс');
  if (!profile.phone || !profile.telegram || !profile.whatsapp) recommendations.push('Заполните профиль');
  else recommendations.push('Откройте новые возможности');

  const events = [
    { name: `Дата регистрации: ${dayjs(profile.createdAt).format('DD.MM.YYYY')}` },
    { name: `Последний вход: ${dayjs(profile.lastLogin).format('DD.MM.YYYY')}` },
  ];


  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #1976d2 0%, #42a5f5 100%)',
      py: { xs: 2, md: 6 },
      px: { xs: 0, md: 2 },
    }}>
      <Box sx={{
        maxWidth: 700,
        mx: 'auto',
        mb: 4,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 6,
        boxShadow: 6,
        p: { xs: 2, md: 4 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute',
          top: -40,
          left: -40,
          width: 160,
          height: 160,
          bgcolor: '#1976d2',
          borderRadius: '50%',
          opacity: 0.13,
          filter: 'blur(24px)',
          zIndex: 0,
        }} />
        <Avatar
          src={profile.photo}
          sx={{ width: 110, height: 110, mx: 'auto', mb: 2, fontSize: 44, bgcolor: '#1976d2', color: 'white', boxShadow: 3, zIndex: 1 }}
        >
          {profile.firstName?.[0] || '?'}
        </Avatar>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 1, zIndex: 1, position: 'relative' }}>
          Привет, {profile.firstName}!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.7, zIndex: 1, position: 'relative' }}>{profile.email}</Typography>
        <Chip
          label={profile.role === 'student' ? 'Студент' : profile.role}
          color="primary"
          sx={{ mt: 2, fontWeight: 700, fontSize: 16, zIndex: 1, position: 'relative' }}
        />
      </Box>

      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 2, mb: 2 }}>
        <Collapse style={{ backgroundColor:'white' }}
          items={[
            {
              label: <Typography variant="h6" fontWeight={700}>Профиль</Typography>,
              className: "panelProfile",
              children: (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Stack spacing={2} sx={{ mt: 2, alignItems: 'center', textAlign: 'center' }}>
                    <ProfileField label="Имя" value={profile.firstName} />
                    <ProfileField label="Фамилия" value={profile.lastName} />
                    <ProfileField label="Email" value={profile.email} />
                    <ProfileField label="Телефон" value={profile.phone} />
                    <ProfileField label="Страна" value={profile.country} />
                    <ProfileField label="Язык" value={profile.language} />
                  </Stack>
                </Box>
              ),
            },
          ]}
        />
      </Box>

      <SectionCard title="Достижения">
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
          <Typography variant="body2" sx={{ mr: 1 }}>Количество пройденных курсов:</Typography>
          <LinearProgress variant="determinate" value={profile.coursesCompleted} sx={{ width: 100, mr: 1 }} />
          <Typography variant="body2">{profile.coursesCompleted}</Typography>
        </Box>
      </SectionCard>

      <SectionCard title="Рекомендации">
        <Stack spacing={2}>
          {recommendations.map((recommendation, index) => (
            <Typography variant="body2" key={index}>{recommendation}</Typography>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="История">
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

export default StudentProfile;
