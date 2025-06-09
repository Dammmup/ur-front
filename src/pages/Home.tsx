import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturedCourses } from '../components/FeaturedCourses';
import { LatestNews } from '../components/LatestNews';

const Home: React.FC = () => (
  <>
    <HeroSection />
    <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>Featured Courses</h2>
    <FeaturedCourses />
    <LatestNews />
  </>
);

export default Home;
