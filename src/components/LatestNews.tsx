import React from 'react';
import { Card, Button } from 'antd';

const news = [
  {
    title: 'Welcome to UyghurLearn Community!',
    date: '24.05.2025',
    author: 'UyghurLearn Team',
    description: 'Welcome to our learning community! This is a place where we can share our experiences, ask questions, and support each other in learning the Uyghur language and culture. Feel free to introduce yourself and share your learning goals!',
    link: '/community/cmb28uquj000hf53tjexq2j36',
  },
];

export const LatestNews: React.FC = () => (
  <section style={{ padding: '48px 0', background: '#fafafa' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>Latest News</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
      {news.map(item => (
        <Card key={item.link} style={{ borderRadius: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{item.title}</h3>
            <p style={{ color: '#888', fontSize: 13 }}>by {item.author} • {item.date}</p>
            <p style={{ color: '#555', marginBottom: 8 }}>{item.description}</p>
            <Button href={item.link} type="link">Read more</Button>
          </div>
        </Card>
      ))}
    </div>
  </section>
);
