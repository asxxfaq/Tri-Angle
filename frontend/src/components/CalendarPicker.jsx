import React, { useState } from 'react';

const CalendarPicker = ({ selectedDate, onChange, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));
  
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate);
    return d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  };

  const isPast = (day) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d < today || (minDate && d < new Date(minDate));
  };

  const days = [];
  const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
  const startDay = firstDayOfMonth(currentMonth.getMonth(), currentMonth.getFullYear());

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let i = 1; i <= totalDays; i++) {
    const disabled = isPast(i);
    days.push(
      <div
        key={i}
        className={`calendar-day ${isSelected(i) ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && onChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i).toISOString().split('T')[0])}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button type="button" onClick={handlePrevMonth} className="calendar-nav-btn">‹</button>
        <div className="calendar-month-year">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button type="button" onClick={handleNextMonth} className="calendar-nav-btn">›</button>
      </div>
      <div className="calendar-weekdays">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="weekday">{d}</div>)}
      </div>
      <div className="calendar-days">
        {days}
      </div>
      
      <style>{`
        .calendar-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          user-select: none;
          max-width: 320px;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .calendar-nav-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--gold);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .calendar-nav-btn:hover {
          background: rgba(201,168,76,0.1);
          border-color: var(--gold);
        }
        .calendar-month-year {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1rem;
        }
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 10px;
        }
        .weekday {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
        }
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--transition);
          color: var(--text-primary);
        }
        .calendar-day:hover:not(.disabled):not(.empty) {
          background: rgba(201,168,76,0.15);
          color: var(--gold-light);
        }
        .calendar-day.selected {
          background: var(--gold);
          color: #1a0a0c;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(201,168,76,0.3);
        }
        .calendar-day.disabled {
          color: var(--text-muted);
          opacity: 0.3;
          cursor: not-allowed;
        }
        .calendar-day.empty {
          cursor: default;
        }
      `}</style>
    </div>
  );
};

export default CalendarPicker;
