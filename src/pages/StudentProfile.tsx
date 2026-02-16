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
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useUser } from '../UserContext';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { updateUser } from '../api';
import './styles/StudentProfile.css';
import { Collapse } from 'antd';
import { Select, MenuItem, InputLabel, Paper } from '@mui/material';
import { SectionCard } from '../components/SectionCard';
import { ProfileField } from '../components/ProfileField';

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
  status?: string;
  cardColor?: string;
  active?: boolean;
}



export const StudentProfile: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: userLoading, setUser, token } = useUser();
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
    birthDate: user.birthDate,
    status: user.status,
    cardColor: user.cardColor,
    active: user.active
  } as UserProfile : null;

  if (userLoading) return <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (!profile || !user) return <MuiAlert severity="warning">{t('studentProfile.missingProfile')}</MuiAlert>;

  const achievements: { name: string }[] = [];
  if (profile.coursesCompleted >= 1) achievements.push({ name: t('studentProfile.achievementFirstSteps') });
  if (profile.coursesCompleted >= 5) achievements.push({ name: t('studentProfile.achievement5Courses') });
  if (profile.firstName && profile.lastName && profile.email && profile.phone && profile.country && profile.language && profile.gender && profile.telegram && profile.whatsapp) achievements.push({ name: t('studentProfile.achievementProfileComplete') });

  // Local state for community card edits
  const [statusText, setStatusText] = React.useState(profile.status || '');
  const [cardStyle, setCardStyle] = React.useState(profile.cardColor || '#1890ff');
  const [bgType, setBgType] = React.useState(cardStyle.startsWith('linear-gradient') ? 'gradient' : 'color');
  const presetGradients = [
    { label: 'Pink → Teal', value: 'linear-gradient(45deg,#fd00e3eb,#e0f7efeb)' },
    { label: 'Sunset', value: 'linear-gradient(45deg,#ff7e5f,#feb47b)' },
    { label: 'Ocean', value: 'linear-gradient(45deg,#43cea2,#185a9d)' },
    { label: 'Lavender', value: 'linear-gradient(45deg,#eecda3,#ef629f)' },
    { label: 'Mint', value: 'linear-gradient(45deg,#a1ffce,#faffd1)' },
    { label: 'Fire', value: 'linear-gradient(45deg,#f83600,#f9d423)' },
    { label: 'Sky', value: 'linear-gradient(45deg,#36d1dc,#5b86e5)' },
    { label: 'Grape', value: 'linear-gradient(45deg,#a18cd1,#fbc2eb)' },
  ];
  const [showInCommunity, setShowInCommunity] = React.useState(profile.active !== false);
  const [saving, setSaving] = React.useState(false);

  const recommendations: string[] = [];
  if (profile.coursesCompleted === 0) recommendations.push(t('studentProfile.recommendationFirstCourse'));
  if (!profile.phone || !profile.telegram || !profile.whatsapp) recommendations.push(t('studentProfile.recommendationCompleteProfile'));
  else recommendations.push(t('studentProfile.recommendationNewOpportunities'));

  const events: { name: string }[] = [
    { name: t('studentProfile.eventRegistrationDate', { date: dayjs(profile.createdAt).format('DD.MM.YYYY') }) },
    { name: t('studentProfile.eventLastLogin', { date: dayjs(profile.lastLogin).format('DD.MM.YYYY') }) },
  ];



  return (
    <Box className="root" sx={{ background: cardStyle }}>
      <Box className="profileContainer">
        <Box className="animatedBg" />
        <Avatar
          src={profile.photo}
          className="avatar"
        >
          {profile.firstName?.[0] || '?'}
        </Avatar>
        <Typography variant="h3" className="greeting">
          {t('studentProfile.greeting', { name: profile.firstName })}
        </Typography>
        <Typography variant="h6" className="email">{profile.email}</Typography>
        <Chip
          label={profile.role === 'student' ? t('studentProfile.roleStudent') : profile.role}
          color="primary"
          className="roleChip"
        />
      </Box>

      <Box className="sectionsContainer">
        <Collapse style={{ backgroundColor: 'white' }}
          items={[
            {
              label: <Typography variant="h6" fontWeight={700}>{t('studentProfile.profileCollapseLabel')}</Typography>,
              className: "panelProfile",
              children: (
                <Box className="profileFieldsContainer">
                  <Stack spacing={2} className="fieldsStack">
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

      {/* Community Card Edit Section */}
      <SectionCard title={t('studentProfile.communityCardTitle')}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label={t('studentProfile.statusLabel')}
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            fullWidth
          />
          <InputLabel>{t('studentProfile.bgType')}</InputLabel>
          <Select value={bgType} onChange={(e) => setBgType(e.target.value)} fullWidth>
            <MenuItem value="color">{t('studentProfile.bgColorOption')}</MenuItem>
            <MenuItem value="gradient">{t('studentProfile.bgGradientOption')}</MenuItem>
          </Select>

          {bgType === 'color' && (
            <input type="color" value={cardStyle.startsWith('linear-gradient') ? '#1890ff' : cardStyle} onChange={(e) => setCardStyle(e.target.value)} style={{ width: '100%', height: 40, border: 'none', padding: 0 }} />
          )}

          {bgType === 'gradient' && (
            <>
              <InputLabel>{t('studentProfile.gradientPreset')}</InputLabel>
              <Select value={presetGradients.find(g => g.value === cardStyle) ? cardStyle : 'custom'} onChange={(e) => {
                if (e.target.value === 'custom') return;
                setCardStyle(e.target.value as string);
              }} fullWidth>
                {presetGradients.map(g => (
                  <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                ))}
                <MenuItem value="custom">{t('studentProfile.customGradientOption')}</MenuItem>
              </Select>
              {(!presetGradients.find(g => g.value === cardStyle)) && (
                <TextField value={cardStyle} onChange={(e) => setCardStyle(e.target.value)} placeholder="linear-gradient(...)" fullWidth sx={{ mt: 1 }} />
              )}
            </>
          )}
          {/* Preview */}
          <InputLabel sx={{ mt: 1 }}>{t('studentProfile.previewLabel')}</InputLabel>
          <Paper variant="outlined" sx={{ height: 80, borderRadius: 2, background: cardStyle }} />
          <FormControlLabel
            control={<Switch checked={showInCommunity} onChange={(e) => setShowInCommunity(e.target.checked)} />}
            label={t('studentProfile.showInCommunity')}
          />
          <Button variant="contained" disabled={saving} onClick={async () => {
            try {
              setSaving(true);
              const userId = (user as any)._id || (user as any).id;
              await updateUser(userId, { status: statusText, cardColor: cardStyle, active: showInCommunity }, token || undefined);
              // refresh local context
              setUser({ ...user, status: statusText, cardColor: cardStyle, active: showInCommunity });
            } catch (e) {
              console.error('Failed to save community card settings', e);
            } finally {
              setSaving(false);
            }
          }}>{t('studentProfile.saveButton')}</Button>
        </Stack>
      </SectionCard>

    </Box>
  );
};

