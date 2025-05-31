import React, { useEffect, useState } from 'react';
import { Calendar, Badge, Popover, Spin, Typography, Empty } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title } = Typography;

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  image?: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  // Группируем события по дате (YYYY-MM-DD)
  const eventsByDate = events.reduce((acc, event) => {
    const d = dayjs(event.date).format('YYYY-MM-DD');
    if (!acc[d]) acc[d] = [];
    acc[d].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Для отображения событий в ячейке календаря
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Закрытие Popover при клике вне его
  React.useEffect(() => {
    const handleClick = () => {
      if (openPopoverId) setOpenPopoverId(null);
    };
    if (openPopoverId) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openPopoverId]);

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayEvents = eventsByDate[dateStr] || [];
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {dayEvents.map(event => (
          <li key={event._id} style={{ position: 'relative', zIndex: 2 }}>
            <Popover
              open={openPopoverId === event._id}
              placement="rightTop"
              title={<span style={{ fontWeight: 600 }}>{event.title}</span>}
              content={
                <div style={{ maxWidth: 260, borderRadius: 12, background: '#fff', boxShadow: '0 4px 24px #0002', padding: 16 }}>
                  <div style={{ marginBottom: 6 }}><b>Дата:</b> {dayjs(event.date).format('LLL')}</div>
                  {event.location && <div style={{ marginBottom: 6 }}><b>Место:</b> {event.location}</div>}
                  <div style={{ margin: '8px 0', color: '#444' }}>{event.description}</div>
                  {event.image && <img src={event.image} alt="event" style={{ width: '100%', borderRadius: 8, marginTop: 8 }} />}
                </div>
              }
              trigger="click"
              onOpenChange={visible => setOpenPopoverId(visible ? event._id : null)}
            >
              <span style={{ cursor: 'pointer', display: 'inline-block' }}>
                <Badge status="processing" text={event.title} />
              </span>
            </Popover>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Календарь мероприятий</Title>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />
      ) : events.length === 0 ? (
        <Empty description="Нет запланированных событий" />
      ) : (
        <Calendar dateCellRender={dateCellRender} />
      )}
    </div>
  );
};

export default Events;
