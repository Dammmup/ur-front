import React from 'react';
import { useUser } from '../UserContext';
import { Menu, Select, Button, Drawer } from 'antd';
import { MenuOutlined, GlobalOutlined, BookOutlined, TeamOutlined, UserOutlined, CalendarOutlined, HomeOutlined, InfoOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../constants';
import './styles/Navbar-new.css';


export const Navbar: React.FC = () => {
  const { user } = useUser();
  const { i18n, t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo">{t('navbar.logo')}</a>
        <div className="nav-desktop">
          <Menu
            mode="horizontal"
            selectable={false}
            style={{ border: 'none', background: 'none' }}
            items={[
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
            ]}
          />
          <Select
            value={i18n.language}
            onChange={lng => i18n.changeLanguage(lng)}
            options={LANGUAGES.map(l => ({ value: l.value, label: l.label }))}
            style={{ width: 120 }}
            prefix={<GlobalOutlined />}
          />
          {localStorage.getItem('token') ? (
            <>
              <a href={user?.role === 'admin' ? '/admin' : '/profile'}>
                <UserOutlined
                  style={{ marginLeft: 16, padding: '6px 18px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 16 }}
                />
              </a>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >{t('navbar.logout')}</Button>
            </>
          ) : (
            <a href="/login">
              <UserOutlined
                style={{ marginLeft: 16, padding: '6px 18px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 16 }}
              />
            </a>
          )}
        </div>
        <Button className="nav-mobile-btn" icon={<MenuOutlined />} type="text" onClick={() => setOpen(true)} />
        <Drawer
          title={t('navbar.menuTitle')}
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          styles={{ body: { padding: 0 } }}
        >
       <div style={{ display: 'flex', flexDirection: 'row',justifyContent: 'space-evenly', gap: 16 ,marginTop: 16}}>
            <Menu
              mode="vertical"
              selectable={false}
              style={{ border: 'none', background: 'none' }}
              items={[
                {
                  key: 'home-m',
                  icon: <HomeOutlined />,
                  label: <a href="/">{t('navbar.home')}</a>,
                },
                {
                  key: 'learn-m',
                  icon: <BookOutlined />,
                  label: <a href="/learn">{t('navbar.learn')}</a>,
                },
                {
                  key: 'community-m',
                  icon: <TeamOutlined />,
                  label: <a href="/community">{t('navbar.community')}</a>,
                },
                {
                  key: 'events-m',
                  icon: <CalendarOutlined />,
                  label: <a href="/events">{t('navbar.events')}</a>,
                },
                {
                  key: 'about-m',
                  icon: <InfoOutlined />,
                  label: <a href="/about-us">{t('navbar.about')}</a>,
                },
                {
                  key: 'pricing-m',
                  icon: <DollarCircleOutlined />,
                  label: <a href="/pricing">{t('navbar.pricing')}</a>,
                },
              ]}
            />
        <div style={{ marginBottom: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 ,alignItems: 'end',alignContent: 'end',justifyContent: 'space-between'}}>
           <div style={{ textAlign: 'center' }}>
            {localStorage.getItem('token') ? (
             user && (
               <span style={{ marginRight: 16, fontWeight: 500, color: '#1677ff', background: '#f4f8ff', borderRadius: 6, padding: '4px 12px' }}>
                 {user.firstName} {user.lastName} — {user.role === 'admin' ? t('navbar.roleAdmin') : user.role === 'teacher' ? t('navbar.roleTeacher') : t('navbar.roleStudent')}
               </span>
             )
           ) : null}
           {localStorage.getItem('token') ? (
              <>
                <a href={user?.role === 'admin' ? '/admin' : '/profile'}>
                  <UserOutlined
                    style={{ fontSize: 28, color: '#1677ff', cursor: 'pointer', background: '#f0f5ff', borderRadius: '50%', padding: 10 }}
                  />
                </a>
                <div>
                  <Button
                    size="small"
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                  >{t('navbar.logout')}</Button>
            </div>
              </>
            ) : (
              <a href="/login">
                <UserOutlined
                  style={{ fontSize: 28, color: '#1677ff', cursor: 'pointer', background: '#f0f5ff', padding: 10 }}
                />
              </a>
            )}
          </div>
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
