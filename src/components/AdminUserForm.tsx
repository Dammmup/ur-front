import React, { useState } from 'react';
import styles from './AdminUserForm.module.css';
import { COUNTRIES, LANGUAGES, ROLES, GENDERS } from '../constants';
import { getUsers, checkUserDuplicate, createUser } from '../api';

const userIcon = (
  <span style={{ fontSize: 32, marginRight: 10, verticalAlign: 'middle' }}>👤</span>
);


interface AdminUserFormProps {
  isRegistration?: boolean;
  // Все возможные поля пользователя для редактирования
  _id?: string;
  firstName?: string;
  lastName?: string;
  login?: string;
  password?: string;
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
}



const AdminUserForm: React.FC<AdminUserFormProps> = (props) => {
  const { isRegistration = false } = props;
  // Новое состояние для логина и пароля
  const [login, setLogin] = useState(props.login || props.phone || '');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(props.firstName || '');
  const [lastName, setLastName] = useState(props.lastName || '');
  const [phone, setPhone] = useState(props.phone || '');
  const [country, setCountry] = useState(props.country || '');
  const [language, setLanguage] = useState(props.language || '');
  const [photo, setPhoto] = useState<string | null>(props.photo || null);

  const [email, setEmail] = useState(props.email || '');
  const [birthday, setBirthday] = useState(props.birthday || '');
  const [notes, setNotes] = useState(props.notes || '');
  const [role, setRole] = useState(props.role || 'student');

  const [gender, setGender] = useState(props.gender || 'male');
  const [telegram, setTelegram] = useState(props.telegram || '');
  const [whatsapp, setWhatsapp] = useState(props.whatsapp || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // При изменении props (например, выбран другой пользователь) обновлять состояния
  React.useEffect(() => {
    setLogin(props.login || props.phone || '');
    setFirstName(props.firstName || '');
    setLastName(props.lastName || '');
    setPhone(props.phone || '');
    setCountry(props.country || '');
    setLanguage(props.language || '');
    setPhoto(props.photo || null);
    setEmail(props.email || '');
    setBirthday(props.birthday || '');
    setNotes(props.notes || '');
    setRole(props.role || 'student');
    setGender(props.gender || 'male');
    setTelegram(props.telegram || '');
    setWhatsapp(props.whatsapp || '');
  }, [props._id]);


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!firstName || !lastName || !login || !password || !country || !language || !email || !gender) {
      setError('Пожалуйста, заполните все обязательные поля!');
      return;
    }
    if (isRegistration) {
      if (!phone || !password) {
        setError('Пожалуйста, заполните телефон и пароль!');
        return;
      }
    } else {
      if (!login || !password) {
        setError('Пожалуйста, заполните логин и пароль!');
        return;
      }
    }
    setLoading(true);
    try {
      const checkRes = await checkUserDuplicate(isRegistration ? phone : login, email);
      if (checkRes.status === 409) {
        setLoading(false);
        setError('Пользователь с такими данными уже существует');
        return;
      }
      let userData: any = {
        firstName, lastName, country, language, photo,
        gender, telegram, whatsapp, email, birthday
      };
      if (isRegistration) {
        userData.username = phone;
        userData.password = password;
        userData.login = phone;
        userData.role = 'student';
      } else {
        userData.username = login;
        userData.password = password;
        userData.phone = phone;
        userData.role = role;
        userData = {
          ...userData,
          notes: role === 'teacher' ? notes : undefined
        };
      }
      const createRes = await createUser(userData);
      const data = await createRes.json();
      if (!createRes.ok) {
        setLoading(false);
        setError(data.error || 'Ошибка при создании пользователя');
        return;
      }
      setLoading(false);
      setSuccess(isRegistration ? 'Регистрация успешна!' : 'Пользователь успешно добавлен!');
      setFirstName(''); setLastName(''); setLogin(''); setPassword(''); setPhone(''); setCountry(''); setLanguage(''); setPhoto(null);
      setEmail(''); setBirthday(''); setNotes('');
      setRole('student'); setGender('male'); setTelegram(''); setWhatsapp('');
    } catch (err) {
      setLoading(false);
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        {userIcon}
        <span className={styles.headerTitle}>{isRegistration ? 'Регистрация пользователя' : 'Добавить пользователя'}</span>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Имя, Фамилия, Телефон, Страна, Язык, Фото */}
        <div className={styles.mb15}>
          <label className={styles.label}>Имя <span style={{ color: '#f5222d' }}>*</span></label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Имя пользователя" className={styles.input} disabled={loading} required />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Фамилия <span style={{ color: '#f5222d' }}>*</span></label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Фамилия пользователя" style={inputStyle} disabled={loading} required />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Логин <span style={{ color: '#f5222d' }}>*</span></label>
          <input type="text" value={login} onChange={e => setLogin(e.target.value)} placeholder="Логин пользователя" style={inputStyle} disabled={loading} required />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Пароль <span style={{ color: '#f5222d' }}>*</span></label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль пользователя" style={inputStyle} disabled={loading} required />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Номер телефона <span style={{ color: '#f5222d' }}>*</span></label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 777 777 77 77" style={inputStyle} disabled={loading} required />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Страна <span style={{ color: '#f5222d' }}>*</span></label>
          <select value={country} onChange={e => setCountry(e.target.value)} style={inputStyle} disabled={loading} required>
            <option value="">Выберите страну</option>
            {COUNTRIES.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Язык <span style={{ color: '#f5222d' }}>*</span></label>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle} disabled={loading} required>
            <option value="">Выберите язык</option>
            {LANGUAGES.map((l: string) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Фотография</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ marginBottom: 8 }} disabled={loading} />
          {photo && (
            <div style={{ marginTop: 8, marginBottom: 0 }}>
              <img src={photo} alt="user" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid #eee', boxShadow: '0 2px 8px #0001' }} />
            </div>
          )}
        </div>
        {/* Роль, Пол, Контакты */}
        {!isRegistration && (
          <>
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Логин <span style={{ color: '#f5222d' }}>*</span></label>
              <input type="text" value={login} onChange={e => setLogin(e.target.value)} placeholder="Логин пользователя" style={inputStyle} disabled={loading} required />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Пароль <span style={{ color: '#f5222d' }}>*</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" style={inputStyle} disabled={loading} required />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Роль</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle} disabled={loading}>
                {ROLES.map((opt: { value: string, label: string }) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </>
        )}
        {isRegistration && (
          <>
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Телефон (логин) <span style={{ color: '#f5222d' }}>*</span></label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 777 777 77 77" style={inputStyle} disabled={loading} required />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Пароль <span style={{ color: '#f5222d' }}>*</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Придумайте пароль" style={inputStyle} disabled={loading} required />
            </div>
            <input type="hidden" value="student" />
          </>
        )}
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Пол</label>
          <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle} disabled={loading}>
            {GENDERS.map((opt: { value: string, label: string }) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Telegram</label>
          <input type="text" value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="@username" style={inputStyle} disabled={loading} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>WhatsApp</label>
          <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+7 777 777 77 77" style={inputStyle} disabled={loading} />
        </div>

        {/* Email, День рождения, пароль (только для регистрации) */}
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@email.com" style={inputStyle} disabled={loading} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>День рождения</label>
          <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} style={inputStyle} disabled={loading} />
        </div>
        {isRegistration && (
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Пароль <span style={{ color: '#f5222d' }}>*</span></label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Придумайте пароль" style={inputStyle} disabled={loading} required />
          </div>
        )}
       
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button type="submit" style={{ flex: 1, background: '#1677ff', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 7, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }} disabled={loading}>{loading ? (isRegistration ? 'Регистрация...' : 'Добавление...') : (isRegistration ? 'Зарегистрироваться' : 'Добавить пользователя')}</button>
          <button type="button" onClick={() => { setFirstName(''); setLastName(''); setPhone(''); setCountry(''); setLanguage(''); setPhoto(null); setEmail(''); setBirthday(''); setNotes(''); setRole('student'); setGender('male'); setTelegram(''); setWhatsapp(''); setError(null); setSuccess(null); setPassword(''); }} style={{ flex: '0 0 50px', background: '#fff', color: '#1677ff', border: '1.5px solid #1677ff', borderRadius: 7, fontWeight: 500, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }} disabled={loading} title="Очистить форму">✕</button>
        </div>
        {error && <div style={{ color: '#f5222d', marginTop: 18, textAlign: 'center', fontSize: 15, fontWeight: 500, background: '#fff1f0', borderRadius: 6, padding: '8px 0' }}>{error}</div>}
        {success && <div style={{ color: '#389e0d', marginTop: 18, textAlign: 'center', fontSize: 15, fontWeight: 500, background: '#f6ffed', borderRadius: 6, padding: '8px 0' }}>{success}</div>}
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 7,
  border: '1.5px solid #e0e0e0',
  fontSize: 16,
  outline: 'none',
  transition: 'border 0.2s',
  boxSizing: 'border-box',
};

export default AdminUserForm;
