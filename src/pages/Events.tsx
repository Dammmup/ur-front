import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import { Calendar, Badge, Spin, Typography, message, Empty } from 'antd';
import { Popover, Modal, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import AdminEventForm from '../components/AdminEventForm';
import { getEvents, deleteEvent } from '../api';

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
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [activePopoverEventId, setActivePopoverEventId] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const fetchEvents = () => {
    setLoading(true);
    getEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Группируем события по дате (YYYY-MM-DD)
  const eventsByDate = events.reduce((acc, event) => {
    const d = dayjs(event.date).format('YYYY-MM-DD');
    if (!acc[d]) acc[d] = [];
    acc[d].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayEvents = eventsByDate[dateStr] || [];
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {dayEvents.map(event => (
          <li key={event._id} style={{ marginBottom: 8 }}>
            <Popover
              open={activePopoverEventId === event._id}
              onOpenChange={open => {
                if (open) {
                  setActivePopoverEventId(event._id);
                } else {
                  setActivePopoverEventId(null);
                }
              }}
              content={
                <div style={{ maxWidth: 260 }}>
                  <div style={{ marginBottom: 6 }}><b>Дата:</b> {dayjs(event.date).format('LLL')}</div>
                  {event.location && <div style={{ marginBottom: 6 }}><b>Место:</b> {event.location}</div>}
                  <div style={{ margin: '8px 0', color: '#444' }}>{event.description}</div>
                  {event.image && <img src={event.image} alt="event" style={{ width: '100%', borderRadius: 8, marginTop: 8 }} />}
                  {user && (user.role === 'admin' || user.role === 'teacher') && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditEvent(event);
                          setActivePopoverEventId(null);
                        }}
                      >Редактировать</Button>
                      <Button
                        danger
                        size="small"
                        onClick={() => {
                          if (window.confirm('Вы действительно хотите удалить это событие?')) {
                            const token = localStorage.getItem('token');
                            deleteEvent(event._id, token || undefined)
                              .then(() => {
                                message.success('Событие удалено!');
                                fetchEvents();
                              })
                              .catch((err: any) => message.error(err.message || 'Ошибка удаления'));
                          }
                          setActivePopoverEventId(null);
                        }}
                      >Удалить</Button>
                    </div>
                  )}
                </div>
              }
              trigger="click"
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
      <Calendar cellRender={dateCellRender} />
    )}

    {/* Modal для редактирования события */}
    <Modal
      open={!!editEvent}
      onCancel={() => setEditEvent(null)}
      title="Редактировать событие"
      footer={null}
      destroyOnClose
    >
      {editEvent && (
        <AdminEventForm
          initialValues={editEvent}
          onSuccess={() => {
            setEditEvent(null);
            fetchEvents();
            message.success('Событие обновлено!');
          }}
          onCancel={() => setEditEvent(null)}
        />
      )}
    </Modal>
  </div>
);
};

export default Events;
