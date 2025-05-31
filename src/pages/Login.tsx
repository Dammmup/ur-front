import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!login || !password) {
      setError('Пожалуйста, заполните все поля!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setSuccess('Успешный вход!');
        setTimeout(() => navigate('/admin'), 700);
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (e) {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: '80px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px #0001' }}>
      <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Вход для администратора</div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label style={{ display: 'block', marginBottom: 8 }}>Логин</label>
        <input
          type="text"
          value={login}
          onChange={e => setLogin(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          disabled={loading}
        />
        <label style={{ display: 'block', marginBottom: 8 }}>Пароль</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 24, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          disabled={loading}
        />
        <button
          type="submit"
          style={{ width: '100%', background: '#1677ff', color: '#fff', padding: 10, border: 'none', borderRadius: 6, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          disabled={loading}
        >{loading ? 'Вход...' : 'Войти'}</button>
        <div>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></div>
        {error && <div style={{ color: 'red', marginTop: 18, textAlign: 'center', fontSize: 15 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 18, textAlign: 'center', fontSize: 15 }}>{success}</div>}
      </form>
    </div>
  );
};

export default Login;
