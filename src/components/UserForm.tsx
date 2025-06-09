import React, { useEffect } from 'react';
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

const userIcon = (
  <span style={{ fontSize: 32, marginRight: 10, verticalAlign: 'middle' }}>👤</span>
);

interface UserFormProps {
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

const UserForm: React.FC<UserFormProps> = (props) => {
  const { isRegistration = false, currentUserRole } = props;
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
        setSnackbar({ open: true, message: 'Пользователь с таким логином или email уже существует!', severity: 'error' });
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
      if (!isRegistration) {
        userData = {
          ...userData,
          notes: values.role === 'teacher' ? values.notes : undefined
        };
      }
      const createRes = await createUser(userData);
      if (!createRes.ok) {
        setLoading(false);
        setSnackbar({ open: true, message: 'Ошибка при создании пользователя!', severity: 'error' });
        return;
      }
      setLoading(false);
      setSnackbar({ open: true, message: isRegistration ? 'Регистрация успешна!' : 'Пользователь успешно добавлен!', severity: 'success' });
    } catch (error) {
      setLoading(false);
      setSnackbar({ open: true, message: 'Ошибка при создании пользователя!', severity: 'error' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log('кнопка нажата');
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
          {isRegistration ? 'Регистрация пользователя' : 'Редактирование пользователя'}
        </Typography>
      </div>
      <Box component="form" onSubmit={handleFormSubmit} sx={{ maxWidth: 480, margin: '0 auto' }}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Имя"
              name="firstName"
              fullWidth
              value={formState.firstName}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, firstName: e.target.value }))}
              error={errors.firstName}
              helperText={errors.firstName && 'Введите имя!'}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Фамилия"
              name="lastName"
              fullWidth
              value={formState.lastName}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, lastName: e.target.value }))}
              error={errors.lastName}
              helperText={errors.lastName && 'Введите фамилию!'}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Номер телефона"
              name="phone"
              fullWidth
              value={formState.phone}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, phone: e.target.value }))}
              error={errors.phone}
              helperText={errors.phone && 'Введите номер телефона!'}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel id="country-label">Страна</InputLabel>
              <Select
                labelId="country-label"
                label="Страна"
                name="country"
                value={formState.country}
                onChange={(e) => setFormState((prev: any) => ({ ...prev, country: e.target.value }))}
              error={errors.country}
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
              <InputLabel id="language-label">Язык</InputLabel>
              <Select
                labelId="language-label"
                label="Язык"
                name="language"
                value={formState.language}
                onChange={(e) => setFormState((prev: any) => ({ ...prev, language: e.target.value }))}
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
              label="Фотография"
              name="photo"
              fullWidth
              value={formState.photo}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, photo: e.target.value }))}
            />
            <input type="file" onChange={handlePhotoChange} />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Логин"
              name="login"
              fullWidth
              value={formState.login}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, login: e.target.value }))}
              error={errors.login}
              helperText={errors.login && 'Введите логин!'}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Пароль"
              name="password"
              type="password"
              fullWidth
              value={formState.password}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, password: e.target.value }))}
              error={errors.password}
              helperText={errors.password && 'Введите пароль!'}
            />
          </Box>
          {(!isRegistration && (currentUserRole === 'admin' || currentUserRole === 'teacher')) && (
            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Роль</InputLabel>
                <Select
                  labelId="role-label"
                  label="Роль"
                  name="role"
                  value={formState.role}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, role: e.target.value }))}
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
              <InputLabel id="gender-label">Пол</InputLabel>
              <Select
                labelId="gender-label"
                label="Пол"
                name="gender"
                value={formState.gender}
                onChange={(e) => setFormState((prev: any) => ({ ...prev, gender: e.target.value }))}
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
                label="Примечания"
                name="notes"
                fullWidth
                value={formState.notes}
                onChange={(e) => setFormState((prev: any) => ({ ...prev, notes: e.target.value }))}
                disabled={currentUserRole !== 'admin'}
              />
            </Box>
          )}
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Telegram"
              name="telegram"
              fullWidth
              value={formState.telegram}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, telegram: e.target.value }))}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="WhatsApp"
              name="whatsapp"
              fullWidth
              value={formState.whatsapp}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, whatsapp: e.target.value }))}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={formState.email}
              onChange={(e) => setFormState((prev: any) => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              helperText={errors.email && 'Введите email!'}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="День рождения"
                value={formState.birthday ? dayjs(formState.birthday) : null}
                onChange={(date) => {
                  setFormState((prev: any) => ({
                    ...prev,
                    birthday: date && dayjs(date).isValid() ? dayjs(date).toISOString() : ''
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.birthday,
                    helperText: errors.birthday,
                    disabled: loading
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
            sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: 16 }}
            disabled={loading}
          >
            {isRegistration ? 'Добавить пользователя' : 'Обновить данные'}
          </Button>
          {(currentUserRole === 'admin') && (
            <Stack direction="column" spacing={2} sx={{ mt: 2, border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={formState.active === 'true'}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, active: e.target.checked ? 'true' : 'false' }))}
                  color="primary"
                  inputProps={{ 'aria-label': 'Активен' }}
                />
                <span>Активен</span>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={formState.access === 'true'}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, access: e.target.checked ? 'true' : 'false' }))}
                  color="primary"
                  inputProps={{ 'aria-label': 'Доступ разрешён' }}
                />
                <span>Доступ разрешён</span>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={formState.blocked === 'true'}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, blocked: e.target.checked ? 'true' : 'false' }))}
                  color="primary"
                  inputProps={{ 'aria-label': 'Заблокирован' }}
                />
                <span>Заблокирован</span>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={formState.emailVerified === 'true'}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, emailVerified: e.target.checked ? 'true' : 'false' }))}
                  color="primary"
                  inputProps={{ 'aria-label': 'Email подтверждён' }}
                />
                <span>Email подтверждён</span>
              </Stack>
              <Box sx={{ width: '100%' }}>
                <TextField
                  label="Курсов завершено"
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

export default UserForm;
