import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Layout } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const EmailVerificationPending: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
        <Title level={2}>{t('emailVerification.title')}</Title>
        <Paragraph style={{ fontSize: '16px' }}>
          {t('emailVerification.message')}
        </Paragraph>
        <Paragraph style={{ fontSize: '14px', color: '#888' }}>
          {t('emailVerification.note')}
        </Paragraph>
      </Content>
    </Layout>
  );
};

export default EmailVerificationPending;
