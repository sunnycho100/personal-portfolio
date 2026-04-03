import { useState } from 'react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MiniCalendar = () => {
    const [date] = useState(new Date());
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className="card mini-calendar">
            <div className="mini-cal-header">
                <span className="mini-cal-month">{MONTHS[month]}</span>
                <span className="mini-cal-year">{year}</span>
            </div>
            <div className="mini-cal-grid">
                {DAYS.map((d) => (
                    <div key={d} className="mini-cal-day-label">{d}</div>
                ))}
                {cells.map((day, i) => (
                    <div
                        key={i}
                        className={`mini-cal-cell ${day === today ? 'mini-cal-today' : ''} ${day === null ? 'mini-cal-empty' : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MiniCalendar;
