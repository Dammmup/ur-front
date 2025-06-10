import React from 'react';
import { Card, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import './styles/LatestNews.css';

interface NewsItem {
  title: string;
  date: string;
  author: string;
  description: string;
  link: string;
}

export const LatestNews: React.FC = () => {
  const { t } = useTranslation();
  const news: NewsItem[] = t('latestNews.news', { returnObjects: true }) as NewsItem[];

  return (
    <section className="latest-news-section">
      <h2 className="latest-news-title">{t('latestNews.title')}</h2>
      <div className="latest-news-grid">
        {news.map(item => (
          <Card key={item.link} className="latest-news-card" style={{ borderRadius: 12 }}>
            <h3 className="latest-news-item-title">{item.title}</h3>
            <p className="latest-news-item-meta">{t('latestNews.byAuthor', { author: item.author })} • {item.date}</p>
            <p className="latest-news-item-description">{item.description}</p>
            <Button href={item.link} type="link">{t('latestNews.readMore')}</Button>
          </Card>
        ))}
      </div>
    </section>
  );
};
