import React from 'react';
import { Button } from 'antd';

export const HeroSection: React.FC = () => (
  <section style={{ background: 'linear-gradient(135deg, #e6f7ff 0%, #fffbe6 100%)', padding: '64px 0', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 24 }}>Learn Uyghur Language & Culture</h1>
    <p style={{ fontSize: '1.25rem', color: '#888', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
      Discover the beauty of Uyghur language through interactive courses, cultural materials, and a supportive community.
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
      <Button type="primary" size="large" href="/learn" style={{ minWidth: 180, fontWeight: 600 }}>Start Learning</Button>
      <Button type="default" size="large" href="/community" style={{ minWidth: 180, fontWeight: 600 }}>Join Community</Button>
    </div>
  </section>
);
