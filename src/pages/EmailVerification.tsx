import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useUser } from '../UserContext';
import { verifyEmail, sendVerificationEmail } from '../api';


const EmailVerification: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Извлекаем email из состояния, переданного со страницы регистрации
  const email = location.state?.email || '';

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const responseData = await verifyEmail(email, values.code);
      message.success(t('emailVerification.successMessage'));
      
      // Если сервер вернул новый токен с обновленными данными пользователя
      if (responseData.token) {
        // Обновляем контекст пользователя с новым токеном
        login(responseData.token);
        navigate('/'); // Перенаправляем на главную страницу
      } else {
        // Если токен не вернулся, то получаем существующий
        const token = localStorage.getItem('token');
        if (token) {
          // Просто переинициализируем текущий токен, чтобы обновить состояние
          login(token);
          navigate('/');
        } else {
          // Если токена нет совсем, то на страницу входа
          navigate('/login');
        }
      }
    } catch (error) {
      message.error(t('emailVerification.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      await sendVerificationEmail(email);
      message.success(t('emailVerification.resendSuccess'));
    } catch (error) {
      message.error(t('emailVerification.resendError'));
    } finally {
      setResending(false);
    }
  };
  
  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>{t('emailVerification.title')}</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>{t('emailVerification.instruction')}</p>
      <Form onFinish={onFinish}>
        <Form.Item
          name="code"
          label={t('emailVerification.codeLabel')}
          rules={[{ required: true, message: t('emailVerification.errorMessage') }]}
        >
          <Input placeholder={t('emailVerification.codeLabel')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            {t('emailVerification.submitButton')}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={handleResendCode} loading={resending} style={{ width: '100%' }}>
            {t('emailVerification.resendButton')}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={() => navigate('/login')} style={{ width: '100%' }}>
            {t('emailVerification.backToLogin')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmailVerification;
