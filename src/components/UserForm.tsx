import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, GENDERS, ROLES, COUNTRIES } from '../constants';
import { checkUserDuplicate, createUser } from '../api';
import styles from './styles/UserForm.module.css';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';



interface UserFormProps {
  isReadOnly?: boolean;
  isRegistration?: boolean;
  _id?: string;
  login?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  language?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  telegram?: string;
  whatsapp?: string;
  role?: string;
  access?: string;
  coursesCompleted?: number;
  createdAt?: string;
  emailVerified?: boolean;
  blocked?: boolean;
  lastLogin?: string;
  notes?: string;
  photo?: string;
  currentUserRole?: string;
  password?: string;
  username?: string;
  active?: string;
}

function filterUserFormValues(user: any) {
  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    country: user.country || '',
    language: user.language || '',
    email: user.email || '',
    birthday: user.birthday || '',
    gender: user.gender || '',
    telegram: user.telegram || '',
    whatsapp: user.whatsapp || '',
    photo: user.photo || '',
    login: user.login || '',
    password: '', // пароль не подставляем из БД
    role: user.role || '',
    notes: user.notes || '',
    access: user.access !== undefined ? String(user.access) : '',
    coursesCompleted: typeof user.coursesCompleted === 'number' ? user.coursesCompleted : 0,
    active: user.active !== undefined ? String(user.active) : '',
    blocked: user.blocked !== undefined ? String(user.blocked) : '',
    emailVerified: user.emailVerified !== undefined ? String(user.emailVerified) : '',
  };
}

export const UserForm: React.FC<UserFormProps> = (props) => {
  const { t } = useTranslation();
  const { isRegistration = false, currentUserRole, isReadOnly = false } = props;
  const isEditMode = !isRegistration;

  const userIcon = (
    <span style={{ fontSize: 32, marginRight: 10, verticalAlign: 'middle' }}>{t('userForm.userIcon')}</span>
  );
  const [loading, setLoading] = React.useState(false);
  const [formState, setFormState] = React.useState(filterUserFormValues(props));
  const [errors] = React.useState<any>({});
  const [snackbar, setSnackbar] = React.useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setFormState(filterUserFormValues(props));
  }, [props]);
  const cleanedValues = React.useMemo(() => filterUserFormValues(props), [props]);

  // Автоматически заполнять поля формы при изменении props
  React.useEffect(() => {
    if (cleanedValues && Object.keys(cleanedValues).length > 0) {
      setFormState(cleanedValues);
    }
  }, [cleanedValues]);

  const handleFinish = async (values: any) => {
    console.log('зашли в функцию');
    setLoading(true);
    try {
      const checkRes = await checkUserDuplicate(isRegistration ? values.phone : values.login, values.email);
      const checkData = await checkRes.json();
      if (checkData.duplicate) {
        setSnackbar({ open: true, message: t('userForm.duplicateUserError'), severity: 'error' });
        setLoading(false);
        return;
      }
      let userData: any = {
        ...values,
        login: isRegistration ? values.phone : values.login,
        username: isRegistration ? values.phone : values.login,
        phone: values.phone,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        country: values.country,
        language: values.language,
        email: values.email,
        photo: values.photo,
        gender: values.gender,
        telegram: values.telegram,
        whatsapp: values.whatsapp,
        birthday: values.birthday,
        role: isRegistration ? 'student' : values.role,
        coursesCompleted: 0,
        access: 'false',
        emailVerified: 'false',
        blocked: 'false',
        active: 'true',
      };
      console.log("создаем запись");
      if (!isRegistration) {
        userData = {
          ...userData,
          notes: values.role === 'teacher' ? values.notes : undefined
        };
      }
      const createRes = await createUser(userData);
      if (!createRes.ok) {
        setLoading(false);
        setSnackbar({ open: true, message: t('userForm.errorCreatingUser'), severity: 'error' });
        return;
      }
      setLoading(false);
      setSnackbar({ open: true, message: isRegistration ? t('userForm.registrationSuccess') : t('userForm.addUserSuccess'), severity: 'success' });
    } catch (error) {
      setLoading(false);
      setSnackbar({ open: true, message: t('userForm.errorCreatingUser'), severity: 'error' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleFinish(formState);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev: any) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        {userIcon}
        <Typography variant="h5" fontWeight={700} sx={{ ml: 1 }}>
          {isEditMode ? t('userForm.titleEdit') : t('userForm.titleRegistration')}
        </Typography>
      </div>
      <Box component="form" onSubmit={handleFormSubmit} sx={{ maxWidth: 480, margin: '0 auto' }}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.firstNameLabel')}
              name="firstName"
              fullWidth
              value={formState.firstName}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, firstName: e.target.value }))}
              error={errors.firstName}
              helperText={errors.firstName && t('userForm.firstNameError')}
              disabled={isReadOnly}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.lastNameLabel')}
              name="lastName"
              fullWidth
              value={formState.lastName}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, lastName: e.target.value }))}
              error={errors.lastName}
              helperText={errors.lastName && t('userForm.lastNameError')}
              disabled={isReadOnly}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.phoneLabel')}
              name="phone"
              fullWidth
              value={formState.phone}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, phone: e.target.value }))}
              error={errors.phone}
              helperText={errors.phone && t('userForm.phoneError')}
              disabled={isReadOnly}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel id="country-label">{t('userForm.countryLabel')}</InputLabel>
              <Select
                labelId="country-label"
                label={t('userForm.countryLabel')}
                name="country"
                value={formState.country}
                onChange={(e) => setFormState((prev: any) => ({ ...prev, country: e.target.value }))}
                disabled={isReadOnly}
              >
                {COUNTRIES.map((c: string) => (
                  <MenuItem key={`country-${c}`} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel id="language-label">{t('userForm.languageLabel')}</InputLabel>
              <Select
                labelId="language-label"
                label={t('userForm.languageLabel')}
                name="language"
                value={formState.language}
                onChange={(e) => setFormState((prev: any) => ({ ...prev, language: e.target.value }))}
                disabled={isReadOnly}
              >
                {Array.isArray(LANGUAGES) && LANGUAGES.length > 0 && typeof LANGUAGES[0] === 'object' ? (
                  (LANGUAGES as { value: string; label: string }[]).map((l) => (
                    <MenuItem key={`lang-${l.value}`} value={l.value}>
                      {l.label}
                    </MenuItem>
                  ))
                ) : (
                  (LANGUAGES as unknown as string[]).map((l) => (
                    <MenuItem key={`lang-${l}`} value={l}>
                      {l}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.photoLabel')}
              name="photo"
              fullWidth
              value={formState.photo}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, photo: e.target.value }))}
              disabled={isReadOnly}
            />
            <input type="file" onChange={handlePhotoChange} disabled={isReadOnly} />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.loginLabel')}
              name="login"
              fullWidth
              value={formState.login}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, login: e.target.value }))}
              error={errors.login}
              helperText={errors.login && t('userForm.loginError')}
              disabled={!isRegistration || isReadOnly}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.passwordLabel')}
              name="password"
              type="password"
              fullWidth
              value={formState.password}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, password: e.target.value }))}
              error={errors.password}
              helperText={errors.password && t('userForm.passwordError')}
              disabled={isReadOnly}
            />
          </Box>
          {(!isRegistration && (currentUserRole === 'admin' || currentUserRole === 'teacher')) && (
            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel id="role-label">{t('userForm.roleLabel')}</InputLabel>
                <Select
                  labelId="role-label"
                  label={t('userForm.roleLabel')}
                  name="role"
                  value={formState.role}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, role: e.target.value }))}
                  disabled={isReadOnly}
                >
                  {ROLES.map((opt: { value: string, label: string }) => (
                    <MenuItem key={`role-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">{t('userForm.genderLabel')}</InputLabel>
              <Select
                labelId="gender-label"
                label={t('userForm.genderLabel')}
                name="gender"
                value={formState.gender}
                onChange={(e) => setFormState((prev: any) => ({ ...prev, gender: e.target.value }))}
                disabled={isReadOnly}
              >
                {GENDERS.map((opt: { value: string, label: string }) => (
                  <MenuItem key={`gender-${opt.value}`} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {(currentUserRole === 'admin' || currentUserRole === 'teacher') && (
            <Box sx={{ width: '100%' }}>
              <TextField
                label={t('userForm.notesLabel')}
                name="notes"
                fullWidth
                value={formState.notes}
                onChange={(e) => setFormState((prev: any) => ({ ...prev, notes: e.target.value }))}
                disabled={currentUserRole !== 'admin' || isReadOnly}
              />
            </Box>
          )}
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.telegramLabel')}
              name="telegram"
              fullWidth
              value={formState.telegram}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, telegram: e.target.value }))}
              disabled={isReadOnly}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.whatsappLabel')}
              name="whatsapp"
              fullWidth
              value={formState.whatsapp}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, whatsapp: e.target.value }))}
              disabled={isReadOnly}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label={t('userForm.emailLabel')}
              name="email"
              fullWidth
              value={formState.email}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              helperText={errors.email && t('userForm.emailError')}
              disabled={isReadOnly}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t('userForm.birthdayLabel')}
                value={formState.birthday ? dayjs(formState.birthday) : null}
                onChange={(date) => {
                  setFormState((prev: any) => ({
                    ...prev,
                    birthday: date && dayjs(date).isValid() ? dayjs(date).toISOString() : ''
                  }));
                }}
                disabled={isReadOnly}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.birthday,
                    helperText: errors.birthday,
                    disabled: loading || isReadOnly
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || isReadOnly}
          >
            {isEditMode ? t('userForm.submitButtonUpdate') : t('userForm.submitButtonAdd')}
          </Button>
          {(currentUserRole === 'admin') && (
            <Stack direction="column" spacing={2} sx={{ mt: 2, border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={formState.active === 'true'}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, active: String(e.target.checked) }))}
                  disabled={isReadOnly}
                  color="primary"
                  inputProps={{ 'aria-label': t('userForm.activeSwitch') }}
                />
                <span>{t('userForm.activeSwitch')}</span>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={formState.access === 'true'}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, access: String(e.target.checked) }))}
                  disabled={isReadOnly}
                  color="primary"
                  inputProps={{ 'aria-label': t('userForm.accessSwitch') }}
                />
                <span>{t('userForm.accessSwitch')}</span>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={formState.blocked === 'true'}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, blocked: String(e.target.checked) }))}
                  disabled={isReadOnly}
                  color="primary"
                  inputProps={{ 'aria-label': t('userForm.blockedSwitch') }}
                />
                <span>{t('userForm.blockedSwitch')}</span>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={formState.emailVerified === 'true'}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, emailVerified: String(e.target.checked) }))}
                  disabled={isReadOnly}
                  color="primary"
                  inputProps={{ 'aria-label': t('userForm.emailVerifiedSwitch') }}
                />
                <span>{t('userForm.emailVerifiedSwitch')}</span>
              </Stack>
              <Box sx={{ width: '100%' }}>
                <TextField
                  label={t('userForm.coursesCompletedLabel')}
                  name="coursesCompleted"
                  type="number"
                  fullWidth
                  value={formState.coursesCompleted}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, coursesCompleted: Number(e.target.value) }))}
                />
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

