import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Typography } from 'antd';
import { login } from '../api';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { login: string; password: string }) => {
    setLoading(true);
    try {
      const res = await login(values.login, values.password);
      console.log(values);
      
      console.log(res.body);
      
      const data = await res.json();
      console.log(data);
      
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        message.success('Успешный вход!');
        setTimeout(() => navigate('/admin'), 700);
      } else {
        message.error(data.error || 'Ошибка входа');
      }
    } catch (e) {
      message.error('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: '80px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px #0001' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Вход для администратора</Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        style={{ width: '100%' }}
      >
        <Form.Item
          label="Логин"
          name="login"
          rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
        >
          <Input placeholder="Логин" size="large" disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
        >
          <Input.Password placeholder="Пароль" size="large" disabled={loading} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{ fontWeight: 600 }}
          >Войти</Button>
        </Form.Item>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
