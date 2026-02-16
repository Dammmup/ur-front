import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Collapse, Typography } from 'antd';
import './styles/AboutUs.css';

const { Paragraph } = Typography;
const { Panel } = Collapse;

export const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="about-us-page">
      <div className="about-us-container">
        <Tabs
          defaultActiveKey="about"
          centered
          items={[
            {
              key: 'about',
              label: t('aboutUs.aboutTabTitle', 'О нас'),
              children: (
                <div>
                  <div className="about-hero">
                    <h1>{t('aboutUs.title', 'Уйгурский Язык')}</h1>
                    <p>{t('aboutUs.description', 'Платформа для изучения уйгурского языка онлайн')}</p>
                  </div>

                  <div className="stats-section">
                    <div className="stat-item">
                      <span className="stat-number">500+</span>
                      <span className="stat-label">Студентов</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">50+</span>
                      <span className="stat-label">Уроков</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">10+</span>
                      <span className="stat-label">Курсов</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">24/7</span>
                      <span className="stat-label">Поддержка</span>
                    </div>
                  </div>

                  <div className="mission-vision-grid">
                    <div className="mission-card">
                      <h2>{t('aboutUs.missionTitle', 'Наша миссия')}</h2>
                      <p>{t('aboutUs.missionText', 'Мы стремимся сделать изучение уйгурского языка доступным для всех. Наша миссия - сохранить и распространить богатое культурное наследие уйгурского народа через образовательные технологии.')}</p>
                    </div>
                    <div className="vision-card">
                      <h2>{t('aboutUs.visionTitle', 'Наше видение')}</h2>
                      <p>{t('aboutUs.visionText', 'Мы видим будущее, где каждый желающий сможет легко и эффективно изучить уйгурский язык, независимо от места проживания или уровня подготовки.')}</p>
                    </div>
                  </div>

                  <div className="values-section">
                    <h2>Наши ценности</h2>
                    <div className="values-grid">
                      <div className="value-item">
                        <span className="value-icon">📚</span>
                        <h3>Качество</h3>
                        <p>Только проверенный и актуальный учебный материал</p>
                      </div>
                      <div className="value-item">
                        <span className="value-icon">🤝</span>
                        <h3>Сообщество</h3>
                        <p>Объединяем людей, увлечённых языком</p>
                      </div>
                      <div className="value-item">
                        <span className="value-icon">💡</span>
                        <h3>Инновации</h3>
                        <p>Современные методы обучения</p>
                      </div>
                      <div className="value-item">
                        <span className="value-icon">🌐</span>
                        <h3>Доступность</h3>
                        <p>Учитесь в любое время и в любом месте</p>
                      </div>
                    </div>
                  </div>

                  <div className="contact-section">
                    <h2>Свяжитесь с нами</h2>
                    <p>У вас есть вопросы? Мы всегда рады помочь!</p>
                    <div className="contact-info">
                      <div className="contact-item">
                        <span>📧</span>
                        <span>Email: info@uyghurlearn.com</span>
                      </div>
                      <div className="contact-item">
                        <span>💬</span>
                        <span>Telegram: @uyghurlearn</span>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: 'privacy',
              label: t('aboutUs.privacyTabTitle', 'Политика конфиденциальности'),
              children: (
                <div className="privacy-policy-page">
                  <div className="privacy-container">
                    <h1>{t('privacy.title', 'Политика конфиденциальности')}</h1>

                    <Collapse defaultActiveKey={['1']} className="policyCollapse" expandIconPosition="end">
                      <Panel header={t('privacy.section1.title', 'Общая информация')} key="1">
                        <Paragraph>
                          {t('privacy.section1.content', 'Платформа YughurLearn предназначена для изучения уйгурского языка. Использование платформы возможно только лицами старше 12 лет. Платформа не имеет юридического статуса и работает как частный образовательный проект.')}
                        </Paragraph>
                      </Panel>

                      <Panel header={t('privacy.section2.title', 'Какие данные мы собираем')} key="2">
                        <Paragraph>
                          {t('privacy.section2.intro', 'Мы собираем и храним следующие данные пользователей:')}
                        </Paragraph>
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
                        <Paragraph>
                          {t('privacy.section3.intro', 'Данные используются исключительно внутри сервиса:')}
                        </Paragraph>
                        <ul>
                          <li>{t('privacy.section3.item1', 'Для авторизации и аутентификации')}</li>
                          <li>{t('privacy.section3.item2', 'Для идентификации личности пользователя')}</li>
                          <li>{t('privacy.section3.item3', 'Для отображения персонализированного контента')}</li>
                          <li>{t('privacy.section3.item4', 'Для внутренней аналитики и учёта успеваемости')}</li>
                        </ul>
                      </Panel>

                      <Panel header={t('privacy.section4.title', 'Передача данных третьим лицам')} key="4">
                        <Paragraph>
                          {t('privacy.section4.content', 'Мы не передаём данные третьим лицам. Вся информация используется только внутри платформы YughurLearn.')}
                        </Paragraph>
                      </Panel>

                      <Panel header={t('privacy.section5.title', 'Где хранятся данные')} key="5">
                        <Paragraph>
                          {t('privacy.section5.content', 'Данные хранятся в MongoDB на защищённых серверах с ограниченным доступом.')}
                        </Paragraph>
                      </Panel>

                      <Panel header={t('privacy.section6.title', 'Права пользователя')} key="6">
                        <Paragraph>
                          {t('privacy.section6.content', 'Пользователь имеет право запросить удаление своих персональных данных, обратившись через Telegram или WhatsApp менеджера. После удаления доступ к платформе будет закрыт.')}
                        </Paragraph>
                      </Panel>

                      <Panel header={t('privacy.section7.title', 'Обучение, оплата и возвраты')} key="7">
                        <Paragraph>
                          {t('privacy.section7.paragraph1', 'Платформа предоставляет доступ к курсам, которые могут быть платными. Стоимость и способы оплаты уточняются через менеджера.')}
                        </Paragraph>
                        <Paragraph>
                          {t('privacy.section7.paragraph2', 'Платёжные данные не собираются через сайт и не обрабатываются напрямую.')}
                        </Paragraph>
                        <Paragraph>
                          {t('privacy.section7.paragraph3', 'Возврат средств, компенсация или иное возмещение невозможны ни при каких условиях. Вместо этого:')}
                        </Paragraph>
                        <ul>
                          <li>{t('privacy.section7.item1', 'Пользователь может использовать оплаченные сеансы до окончания подписки;')}</li>
                          <li>{t('privacy.section7.item2', 'Или передать их другому пользователю (с одобрения менеджера).')}</li>
                        </ul>
                      </Panel>
                    </Collapse>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
