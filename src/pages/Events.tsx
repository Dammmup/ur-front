import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import { Calendar, Badge, Spin, Typography, message, Empty } from 'antd';
import { Popover, Modal, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AdminEventForm } from '../components/AdminEventForm';
import { getEvents, deleteEvent } from '../api';
import { useTranslation } from 'react-i18next';
import './styles/Events.css';

const { Title } = Typography;

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  image?: string;
}

export const Events: React.FC = () => {
  const { t } = useTranslation();
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
                  <div style={{ marginBottom: 6 }}><b>{t('eventsPage.dateLabel')}</b> {dayjs(event.date).format('LLL')}</div>
                  {event.location && <div style={{ marginBottom: 6 }}><b>{t('eventsPage.locationLabel')}</b> {event.location}</div>}
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
                      >{t('eventsPage.editButton')}</Button>
                      <Button
                        danger
                        size="small"
                        onClick={() => {
                          if (window.confirm(t('eventsPage.deleteConfirmation'))) {
                            const token = localStorage.getItem('token');
                            deleteEvent(event._id, token || undefined)
                              .then(() => {
                                message.success(t('eventsPage.deleteSuccess'));
                                fetchEvents();
                              })
                              .catch((err: any) => message.error(err.message || t('eventsPage.deleteError')));
                          }
                          setActivePopoverEventId(null);
                        }}
                      >{t('eventsPage.deleteButton')}</Button>
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
    <div className="events-page">
      <div className="events-container">
        <Title level={2}>{t('eventsPage.title')}</Title>
        {loading ? (
          <Spin size="large" className="loading-spin" />
        ) : events.length === 0 ? (
          <Empty className="no-events" description={t('eventsPage.noEvents')} />
        ) : (
          <Calendar cellRender={dateCellRender} />
        )}

        <Modal
          open={!!editEvent}
          onCancel={() => setEditEvent(null)}
          title={t('eventsPage.editModalTitle')}
          footer={null}
          destroyOnHidden
        >
          {editEvent && (
            <AdminEventForm
              initialValues={editEvent}
              onSuccess={() => {
                setEditEvent(null);
                fetchEvents();
                message.success(t('eventsPage.updateSuccess'));
              }}
              onCancel={() => setEditEvent(null)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};
