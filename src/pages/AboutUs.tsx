import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Typography, Collapse } from 'antd';
import styles from './styles/AboutUs.module.css';

export const AboutUs: React.FC = () => {
  const { t } = useTranslation();
  const { Panel } = Collapse;
  
  return (
    <div className={styles.container}>
      <Tabs 
        defaultActiveKey="about" 
        items={[
          {
            key: 'about',
            label: t('aboutUs.aboutTabTitle', 'О нас'),
            children: (
              <div>
                <h1 className={styles.title}>{t('aboutUs.title')}</h1>
                <p className={styles.description}>{t('aboutUs.description')}</p>
                <div className={styles.content}>
                  <h2>{t('aboutUs.missionTitle')}</h2>
                  <p>{t('aboutUs.missionText')}</p>
                  <h2>{t('aboutUs.visionTitle')}</h2>
                  <p>{t('aboutUs.visionText')}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'privacy',
            label: t('aboutUs.privacyTabTitle', 'Политика конфиденциальности'),
            children: (
              <div className={styles.privacyPolicy}>
                <h1>{t('privacy.title', 'Политика конфиденциальности')}</h1>
                
                <Collapse defaultActiveKey={['1']} className={styles.policyCollapse}>
                  <Panel header={t('privacy.section1.title', 'Общая информация')} key="1">
                    <Typography.Paragraph>
                      {t('privacy.section1.content', 'Платформа YughurLearn предназначена для изучения уйгурского языка. Использование платформы возможно только лицами старше 12 лет. Платформа не имеет юридического статуса и работает как частный образовательный проект.')}
                    </Typography.Paragraph>
                  </Panel>
                  
                  <Panel header={t('privacy.section2.title', 'Какие данные мы собираем')} key="2">
                    <Typography.Paragraph>
                      {t('privacy.section2.intro', 'Мы собираем и храним следующие данные пользователей:')}
                    </Typography.Paragraph>
                    <ul>
                      <li>{t('privacy.section2.item1', 'Имя и фамилия')}</li>
                      <li>{t('privacy.section2.item2', 'Email')}</li>
                      <li>{t('privacy.section2.item3', 'Номер телефона')}</li>
                      <li>{t('privacy.section2.item4', 'Страна, язык, пол')}</li>
                      <li>{t('privacy.section2.item5', 'Telegram и WhatsApp (если указано)')}</li>
                      <li>{t('privacy.section2.item6', 'Дата рождения')}</li>
                      <li>{t('privacy.section2.item7', 'Фото (опционально)')}</li>
                      <li>{t('privacy.section2.item8', 'Статус активности, дата регистрации и последнего входа')}</li>
                      <li>{t('privacy.section2.item9', 'Курсы, к которым предоставлен доступ, и статус их завершения')}</li>
                      <li>{t('privacy.section2.item10', 'Роль в системе (например, студент, преподаватель, админ)')}</li>
                      <li>{t('privacy.section2.item11', 'Подтверждение email')}</li>
                      <li>{t('privacy.section2.item12', 'Флаг блокировки и активности')}</li>
                      <li>{t('privacy.section2.item13', 'Хешированный пароль')}</li>
                    </ul>
                  </Panel>
                  
                  <Panel header={t('privacy.section3.title', 'Цель сбора данных')} key="3">
                    <Typography.Paragraph>
                      {t('privacy.section3.intro', 'Данные используются исключительно внутри сервиса:')}
                    </Typography.Paragraph>
                    <ul>
                      <li>{t('privacy.section3.item1', 'Для авторизации и аутентификации')}</li>
                      <li>{t('privacy.section3.item2', 'Для идентификации личности пользователя')}</li>
                      <li>{t('privacy.section3.item3', 'Для отображения персонализированного контента')}</li>
                      <li>{t('privacy.section3.item4', 'Для внутренней аналитики и учёта успеваемости')}</li>
                    </ul>
                  </Panel>
                  
                  <Panel header={t('privacy.section4.title', 'Передача данных третьим лицам')} key="4">
                    <Typography.Paragraph>
                      {t('privacy.section4.content', 'Мы не передаём данные третьим лицам. Вся информация используется только внутри платформы YughurLearn.')}
                    </Typography.Paragraph>
                  </Panel>
                  
                  <Panel header={t('privacy.section5.title', 'Где хранятся данные')} key="5">
                    <Typography.Paragraph>
                      {t('privacy.section5.content', 'Данные хранятся в MongoDB на защищённых серверах с ограниченным доступом.')}
                    </Typography.Paragraph>
                  </Panel>
                  
                  <Panel header={t('privacy.section6.title', 'Права пользователя')} key="6">
                    <Typography.Paragraph>
                      {t('privacy.section6.content', 'Пользователь имеет право запросить удаление своих персональных данных, обратившись через Telegram или WhatsApp менеджера. После удаления доступ к платформе будет закрыт.')}
                    </Typography.Paragraph>
                  </Panel>
                  
                  <Panel header={t('privacy.section7.title', 'Обучение, оплата и возвраты')} key="7">
                    <Typography.Paragraph>
                      {t('privacy.section7.paragraph1', 'Платформа предоставляет доступ к курсам, которые могут быть платными. Стоимость и способы оплаты уточняются через менеджера.')}
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                      {t('privacy.section7.paragraph2', 'Платёжные данные не собираются через сайт и не обрабатываются напрямую.')}
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                      {t('privacy.section7.paragraph3', 'Возврат средств, компенсация или иное возмещение невозможны ни при каких условиях. Вместо этого:')}
                    </Typography.Paragraph>
                    <ul>
                      <li>{t('privacy.section7.item1', 'Пользователь может использовать оплаченные сеансы до окончания подписки;')}</li>
                      <li>{t('privacy.section7.item2', 'Или передать их другому пользователю (с одобрения менеджера).')}</li>
                    </ul>
                  </Panel>
                </Collapse>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
