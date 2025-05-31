import React from 'react';
import { Menu, Select, Button, Drawer } from 'antd';
import { MenuOutlined, GlobalOutlined, BookOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from '../../node_modules/react-i18next';

const languages = [
  { code: 'ug', label: 'ئۇيغۇرچە' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'sv', label: 'Svenska' },
  { code: 'kk', label: 'Қазақша' },
  { code: 'tr', label: 'Türkçe' },
];

export const Navbar: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 64, justifyContent: 'space-between' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 24, color: '#1677ff', textDecoration: 'none' }}>UyghurLearn</a>
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Menu
            mode="horizontal"
            selectable={false}
            style={{ border: 'none', background: 'none' }}
            items={[
              {
                key: 'home',
                icon: <BookOutlined />,
                label: <a href="/">Home</a>,
              },
              {
                key: 'learn',
                icon: <BookOutlined />,
                label: <a href="/learn">Learn</a>,
              },
              {
                key: 'community',
                icon: <TeamOutlined />,
                label: <a href="/community">Community</a>,
              },
              {
                key: 'events',
                icon: <BookOutlined />, // Можно заменить на CalendarOutlined
                label: <a href="/events">Events</a>,
              },
            ]}
          />
          <Select
            value={i18n.language}
            onChange={lng => i18n.changeLanguage(lng)}
            options={languages.map(l => ({ value: l.code, label: l.label }))}
            style={{ width: 120 }}
            prefix={<GlobalOutlined />}
          />
          {localStorage.getItem('token') ? (
            <>
              <a href="/admin">
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
              >Выйти</Button>
            </>
          ) : (
            <a href="/login">
              <UserOutlined
                style={{ marginLeft: 16, padding: '6px 18px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 16 }}
              />
            </a>
          )}
        </div>
        <Button className="nav-mobile-btn" icon={<MenuOutlined />} type="text" style={{ display: 'none' }} onClick={() => setOpen(true)} />
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          styles={{ body: { padding: 0 } }}
        >
          <Select
            value={i18n.language}
            onChange={lng => i18n.changeLanguage(lng)}
            options={languages.map(l => ({ value: l.code, label: l.label }))}
            style={{ width: 120, marginTop: 16 }}
            prefix={<GlobalOutlined />}
          />
          <Menu
            mode="vertical"
            selectable={false}
            style={{ border: 'none', background: 'none' }}
            items={[
              {
                key: 'home-m',
                icon: <BookOutlined />,
                label: <a href="/">Home</a>,
              },
              {
                key: 'learn-m',
                icon: <BookOutlined />,
                label: <a href="/learn">Learn</a>,
              },
              {
                key: 'community-m',
                icon: <TeamOutlined />,
                label: <a href="/community">Community</a>,
              },
            ]}
          />

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            {localStorage.getItem('token') ? (
              <>
                <a href="/admin">
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
                  >Выйти</Button>
                </div>
              </>
            ) : (
              <a href="/login">
                <UserOutlined
                  style={{ fontSize: 28, color: '#1677ff', cursor: 'pointer', background: '#f0f5ff', borderRadius: '50%', padding: 10 }}
                />
                <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>Admin</div>
              </a>
            )}
          </div>

        </Drawer>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
};
