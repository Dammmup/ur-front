import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturedCourses } from '../components/FeaturedCourses';
import { LatestNews } from '../components/LatestNews';
import { useTranslation } from 'react-i18next';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeroSection />
      <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>{t('homePage.featuredCoursesTitle')}</h2>
      <FeaturedCourses />
      <LatestNews />
    </>
  );
};

