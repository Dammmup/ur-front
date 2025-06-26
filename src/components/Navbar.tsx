import React, { useMemo } from 'react';
import { useUser } from '../UserContext';
import { Menu, Select, Button, Drawer } from 'antd';
import { MenuOutlined, GlobalOutlined, BookOutlined, TeamOutlined, UserOutlined, CalendarOutlined, HomeOutlined, InfoOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../constants';
import styles from './styles/Navbar.module.css';


export const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const { i18n, t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  
  // Определяем элементы меню в одном месте для повторного использования
  // Добавляем i18n.language в зависимости, чтобы меню обновлялось при смене языка
  const menuItems = useMemo(() => [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <a href="/">{t('navbar.home')}</a>,
    },
    {
      key: 'learn',
      icon: <BookOutlined />,
      label: <a href="/learn">{t('navbar.learn')}</a>,
    },
    {
      key: 'community',
      icon: <TeamOutlined />,
      label: <a href="/community">{t('navbar.community')}</a>,
    },
    {
      key: 'events',
      icon: <CalendarOutlined />,
      label: <a href="/events">{t('navbar.events')}</a>,
    },
    {
      key: 'about',
      icon: <InfoOutlined />,
      label: <a href="/about-us">{t('navbar.about')}</a>,
    },
    {
      key: 'pricing',
      icon: <DollarCircleOutlined />,
      label: <a href="/pricing">{t('navbar.pricing')}</a>,
    },
  ], [t, i18n.language]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <a href="/" className={styles.navLogo}>{t('navbar.logo')}</a>
        <div className={styles.navDesktop}>
          <Menu

            mode="horizontal"
            selectable={false}
            style={{ border: 'none', background: 'none', margin: '0 16px' }}
            items={menuItems}
          />
          <Select
            value={i18n.language}
            onChange={lng => i18n.changeLanguage(lng)}
            options={LANGUAGES.map(l => ({ value: l.value, label: l.label }))}
            style={{ width: 120 }}
            prefix={<GlobalOutlined />}
          />
          {user ? (
            <>
              <a href={user.role === 'admin' || user.role === 'teacher' ? '/admin' : '/profile'}>
                <UserOutlined className={styles.loginIcon} />
              </a>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
              >{t('navbar.logout')}</Button>
            </>
          ) : (
            <a href="/login">
              <UserOutlined className={styles.loginIcon} />
            </a>
          )}
        </div>
        <Button className={styles.navMobileBtn} icon={<MenuOutlined />} type="text" onClick={() => setOpen(true)} />
        <Drawer
          title={t('navbar.menuTitle')}
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          styles={{ body: { padding: 0 } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
            <Menu
              mode="vertical"
              selectable={false}
              style={{ border: 'none', background: 'none' }}
              items={menuItems.map(item => ({ ...item, key: `${item.key}-m` }))}
            />
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              {user && (
                <span className={styles.userProfileCard}>
                  {user.firstName} {user.lastName} — {user.role === 'admin' ? t('navbar.roleAdmin') : user.role === 'teacher' ? t('navbar.roleTeacher') : t('navbar.roleStudent')}
                </span>
              )}
              
              {user ? (
                <>
                  <a href={user.role === 'admin' || user.role === 'teacher' ? '/admin' : '/profile'}>
                    <UserOutlined className={styles.userIcon} />
                  </a>
                  <Button
                    size="small"
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                  >
                    {t('navbar.logout')}
                  </Button>
                </>
              ) : (
                <a href="/login">
                  <UserOutlined className={styles.userIcon} />
                </a>
              )}
              
              <Select
                value={i18n.language}
                onChange={lng => i18n.changeLanguage(lng)}
                options={LANGUAGES.map(l => ({ value: l.value, label: l.label }))}
                style={{ width: 120, marginTop: 16 }}
                prefix={<GlobalOutlined />}
              />
            </div>
          </div>
        </Drawer>
      </div>
    </nav>
  );
};
