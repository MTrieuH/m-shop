import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiArrowRight, FiZap, FiClock, FiCheckCircle } from 'react-icons/fi';
import usePageMeta from '../hooks/usePageMeta';
import { getEvents } from '../services/api';
import { formatDate } from '../utils/helpers';
import './SaleEvents.css';

export default function SaleEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta('Sự Kiện Sale', 'Cập nhật các chương trình khuyến mãi đang diễn ra, sắp tới và đã kết thúc tại M-Shop.');

  useEffect(() => {
    getEvents({ type: 'Sale' })
      .then(res => setEvents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeEvents = events.filter(e => e.status === 'Active');
  const upcomingEvents = events.filter(e => e.status === 'Upcoming');
  const endedEvents = events.filter(e => e.status === 'Ended');

  const formatDateRange = (start, end) => {
    if (!start) return '';
    const s = formatDate(start);
    const e = end ? formatDate(end) : '';
    return e && s !== e ? `${s} — ${e}` : s;
  };

  const renderEventCard = (event) => (
    <div key={event.id} className={`event-card status-${event.status}`}>
      <div className="event-card-top">
        <h3>{event.title}</h3>
        {event.badgeText && (
          <span className={`event-badge badge-${event.status}`}>{event.badgeText}</span>
        )}
      </div>
      {event.description && (
        <p className="event-card-desc">{event.description}</p>
      )}
      <div className="event-card-meta">
        <span className="event-date">
          <FiCalendar size={14} />
          {formatDateRange(event.startDate, event.endDate)}
        </span>
        {event.linkUrl && (
          <Link to={event.linkUrl} className="event-link">
            Xem sản phẩm <FiArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="sale-events-page">
        <div className="container">
          <div className="events-loading"><div className="spinner" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="sale-events-page">
      <div className="container">
        <div className="page-header">
          <h1>🏷️ Sự Kiện Sale</h1>
          <p>Cập nhật chương trình khuyến mãi từ M-Shop — Đừng bỏ lỡ!</p>
        </div>

        {events.length === 0 ? (
          <div className="events-empty">
            <div className="empty-icon">🏷️</div>
            <h3>Chưa có sự kiện nào</h3>
            <p>Hãy quay lại sau để xem các chương trình khuyến mãi mới nhất!</p>
          </div>
        ) : (
          <>
            {activeEvents.length > 0 && (
              <div className="event-group group-active">
                <div className="event-group-title">
                  <div className="group-icon"><FiZap /></div>
                  Đang Diễn Ra
                  <span className="event-group-count">{activeEvents.length}</span>
                </div>
                <div className="events-timeline">
                  {activeEvents.map(renderEventCard)}
                </div>
              </div>
            )}

            {upcomingEvents.length > 0 && (
              <div className="event-group group-upcoming">
                <div className="event-group-title">
                  <div className="group-icon"><FiClock /></div>
                  Sắp Tới
                  <span className="event-group-count">{upcomingEvents.length}</span>
                </div>
                <div className="events-timeline">
                  {upcomingEvents.map(renderEventCard)}
                </div>
              </div>
            )}

            {endedEvents.length > 0 && (
              <div className="event-group group-ended">
                <div className="event-group-title">
                  <div className="group-icon"><FiCheckCircle /></div>
                  Đã Kết Thúc
                  <span className="event-group-count">{endedEvents.length}</span>
                </div>
                <div className="events-timeline">
                  {endedEvents.map(renderEventCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
