import React from 'react';
import { Card, Tag, Button } from 'antd';

const courses = [
  {
    title: 'Uyghur for Children',
    tag: 'children',
    description: 'Fun and interactive Uyghur lessons designed specifically for young learners.',
    img: 'https://uyghurlear-6bqwrp1t.on.adaptive.ai/cdn/qg7LWpHMEqCWyhMKc28DCG6FytQ7W9Ci.png',
    link: '/learn/cmb28uqt8000af53tyy9whlas',
    materials: 1,
  },
  {
    title: 'Uyghur for Beginners',
    tag: 'beginner',
    description: 'Start your journey learning the beautiful Uyghur language with basic vocabulary and phrases.',
    img: 'https://uyghurlear-6bqwrp1t.on.adaptive.ai/cdn/qg7LWpHMEqCWyhMKc28DCG6FytQ7W9Ci.png',
    link: '/learn/cmb28uqsv0008f53tomollu7e',
    materials: 1,
  },
  {
    title: 'Uyghur for Children',
    tag: 'children',
    description: 'Fun and interactive Uyghur lessons designed specifically for young learners.',
    img: 'https://uyghurlear-6bqwrp1t.on.adaptive.ai/cdn/7V3GJTYMmURApFwgAL3Y8VW6xJhq7KFd.png',
    link: '/learn/cmb28ssl2000azghak5aqsamc',
    materials: 1,
  },
];

export const FeaturedCourses: React.FC = () => (
  <section style={{ padding: '48px 0' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>Featured Courses</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
      {courses.map(course => (
        <Card
          key={course.link}
          hoverable
          cover={<img alt={course.title} src={course.img} style={{ height: 192, objectFit: 'cover' }} />}
          style={{ borderRadius: 12 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{course.title}</h3>
              <Tag color={course.tag === 'children' ? 'blue' : 'green'} style={{ marginLeft: 8 }}>{course.tag}</Tag>
            </div>
            <p style={{ color: '#888' }}>{course.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 14, color: '#888' }}>{course.materials} materials</span>
              <Button href={course.link} type="default" size="small">View Course</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </section>
);
