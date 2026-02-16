import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Typography } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { login } from '../api';
import { useUser } from '../UserContext';
import { useTranslation } from 'react-i18next';
import './styles/Login.css';

const { Title } = Typography;

type User = {
  id: string;
  role: string;
  [key: string]: any;
};

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginCtx } = useUser();

  const onFinish = async (values: { login: string; password: string }) => {
    setLoading(true);
    try {
      const res = await login(values.login, values.password);
      const data = await res.json();
      if (res.ok && data.token) {
        const decoded = jwtDecode<User>(data.token);
        if (decoded.id && decoded.role) {
          localStorage.setItem('token', data.token);
          loginCtx(data.token);
          message.success(t('login.success'));
          if (decoded.role === 'admin' || decoded.role === 'teacher') {
            navigate('/admin');
          }
          else {
            navigate('/profile');
          }
        } else {
          message.error(t('login.invalidTokenError'));
        }
      } else {
        message.error(data.error || t('login.genericError'));
      }
    } catch (e) {
      message.error(t('login.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Title level={3} className="login-title">{t('login.title')}</Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="login-form"
        >
          <Form.Item
            label={t('login.loginLabel')}
            name="login"
            rules={[{ required: true, message: t('login.loginRequiredError') }]}
          >
            <Input placeholder={t('login.loginPlaceholder')} size="large" disabled={loading} />
          </Form.Item>
          <Form.Item
            label={t('login.passwordLabel')}
            name="password"
            rules={[{ required: true, message: t('login.passwordRequiredError') }]}
          >
            <Input.Password placeholder={t('login.passwordPlaceholder')} size="large" disabled={loading} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="login-button"
            >{t('login.submitButton')}</Button>
          </Form.Item>
          <div className="login-footer">
            {t('login.noAccount')} <Link to="/register">{t('login.registerLink')}</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};
