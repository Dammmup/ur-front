import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturedCourses } from '../components/FeaturedCourses';
import { LatestNews } from '../components/LatestNews';

const Home: React.FC = () => (
  <>
    <HeroSection />
    <FeaturedCourses />
    <LatestNews />
  </>
);

export default Home;
