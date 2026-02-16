import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useUser } from '../UserContext';
import { verifyEmail, sendVerificationEmail } from '../api';
import './styles/EmailVerification.css';


const EmailVerification: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const email = location.state?.email || '';

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const responseData = await verifyEmail(email, values.code);
      message.success(t('emailVerification.successMessage'));

      if (responseData.token) {
        login(responseData.token);
        navigate('/');
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          login(token);
          navigate('/');
        } else {
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
    <div className="email-verification-page">
      <div className="email-verification-container">
        <h2 className="email-verification-title">{t('emailVerification.title')}</h2>
        <p className="email-verification-desc">{t('emailVerification.instruction')}</p>
        <Form onFinish={onFinish} className="email-verification-form">
          <Form.Item
            name="code"
            label={t('emailVerification.codeLabel')}
            rules={[{ required: true, message: t('emailVerification.errorMessage') }]}
          >
            <Input placeholder={t('emailVerification.codeLabel')} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large" className="verify-button">
              {t('emailVerification.submitButton')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={handleResendCode} loading={resending} block>
              {t('emailVerification.resendButton')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => navigate('/login')} block>
              {t('emailVerification.backToLogin')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EmailVerification;
