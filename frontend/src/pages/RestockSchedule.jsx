import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiX, FiArrowRight, FiInfo, FiClock, FiTag } from 'react-icons/fi';
import usePageMeta from '../hooks/usePageMeta';
import { getEvents } from '../services/api';
import { formatDate } from '../utils/helpers';
import './RestockSchedule.css';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const TYPE_LABELS = {
  NewArrival: 'Hàng Mới',
  Restock: 'Về Lại',
  Event: 'Sự Kiện',
  Sale: 'Sale',
};

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay(); // 0=Sun
  const days = [];

  // Previous month padding
  const prevMonthLast = new Date(year, month, 0).getDate();
  for (let i = startPad - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, prevMonthLast - i), otherMonth: true });
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), otherMonth: false });
  }

  // Next month padding
  const remaining = 42 - days.length; // 6 rows
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), otherMonth: true });
  }

  return days;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date, start, end) {
  if (!start) return false;
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate());
  const e = end ? new Date(new Date(end).getFullYear(), new Date(end).getMonth(), new Date(end).getDate()) : s;
  return d >= s && d <= e;
}

export default function RestockSchedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  usePageMeta('Lịch Hàng Về', 'Lịch cập nhật hàng mới và restock tại M-Shop. Theo dõi lô hàng sắp về để không bỏ lỡ!');

  useEffect(() => {
    getEvents()
      .then(res => setEvents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const days = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  const getEventsForDay = (date) => {
    return events.filter(e => isInRange(date, e.startDate, e.endDate));
  };

  if (loading) {
    return (
      <div className="restock-page">
        <div className="container">
          <div className="restock-loading"><div className="spinner" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="restock-page">
      <div className="container">
        <div className="page-header">
          <h1>📅 Lịch Hàng Về & Restock</h1>
          <p>Theo dõi lô hàng mới và sản phẩm sắp về kho</p>
        </div>

        <div className="restock-notice">
          <FiInfo size={18} />
          <span>Lịch chỉ cập nhật với các lô hàng <strong>đã xác nhận</strong> từ nhà phân phối và thường được cập nhật trước 1 tuần.</span>
        </div>

        {/* Calendar Controls */}
        <div className="calendar-controls">
          <div className="calendar-nav">
            <button onClick={prevMonth} aria-label="Tháng trước"><FiChevronLeft size={18} /></button>
            <span className="calendar-month-label">{monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</span>
            <button onClick={nextMonth} aria-label="Tháng sau"><FiChevronRight size={18} /></button>
          </div>
          <button className="calendar-today-btn" onClick={goToday}>Hôm nay</button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-wrapper">
          <div className="calendar-grid">
            {WEEKDAYS.map(d => (
              <div key={d} className="calendar-day-header">{d}</div>
            ))}
            {days.map((day, i) => {
              const dayEvents = getEventsForDay(day.date);
              const isToday = isSameDay(day.date, today);
              return (
                <div
                  key={i}
                  className={`calendar-day${day.otherMonth ? ' other-month' : ''}${isToday ? ' is-today' : ''}`}
                >
                  <div className="day-number">{day.date.getDate()}</div>
                  <div className="calendar-events">
                    {dayEvents.slice(0, 3).map(ev => (
                      <div
                        key={ev.id}
                        className={`cal-event type-${ev.type}`}
                        onClick={() => setSelectedEvent(ev)}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="cal-more">+{dayEvents.length - 3} thêm</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="calendar-legend">
          <div className="legend-item"><div className="legend-dot type-NewArrival" /> Hàng Mới</div>
          <div className="legend-item"><div className="legend-dot type-Restock" /> Về Lại Kho</div>
          <div className="legend-item"><div className="legend-dot type-Event" /> Sự Kiện</div>
          <div className="legend-item"><div className="legend-dot type-Sale" /> Sale</div>
        </div>

        {/* Event Detail Popup */}
        {selectedEvent && (
          <div className="event-detail-overlay" onClick={() => setSelectedEvent(null)}>
            <div className="event-detail-popup" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedEvent(null)}><FiX /></button>
              <span className={`popup-type-badge cal-event type-${selectedEvent.type}`}>
                {TYPE_LABELS[selectedEvent.type] || selectedEvent.type}
              </span>
              <h3>{selectedEvent.title}</h3>
              {selectedEvent.description && <p className="popup-desc">{selectedEvent.description}</p>}
              <div className="popup-meta">
                <div className="popup-meta-item">
                  <FiCalendar size={14} />
                  {formatDate(selectedEvent.startDate)}
                  {selectedEvent.endDate && selectedEvent.startDate !== selectedEvent.endDate && ` — ${formatDate(selectedEvent.endDate)}`}
                </div>
                <div className="popup-meta-item">
                  <FiClock size={14} />
                  Trạng thái: <strong>{selectedEvent.status === 'Active' ? 'Đang diễn ra' : selectedEvent.status === 'Upcoming' ? 'Sắp tới' : 'Đã kết thúc'}</strong>
                </div>
                {selectedEvent.badgeText && (
                  <div className="popup-meta-item">
                    <FiTag size={14} />
                    {selectedEvent.badgeText}
                  </div>
                )}
              </div>
              {selectedEvent.linkUrl && (
                <Link to={selectedEvent.linkUrl} className="popup-link" onClick={() => setSelectedEvent(null)}>
                  Xem sản phẩm <FiArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
