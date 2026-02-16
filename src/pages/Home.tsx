import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturedCourses } from '../components/FeaturedCourses';
import { LatestNews } from '../components/LatestNews';
import { useTranslation } from 'react-i18next';
import './styles/Home.css';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="home-page">
      <HeroSection />
      <div className="home-content">
        <h2 className="section-title">{t('homePage.featuredCoursesTitle')}</h2>
        <FeaturedCourses />
        <LatestNews />
      </div>
    </div>
  );
};
