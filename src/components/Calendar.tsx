import React, { useState } from "react";
import Modal from "./Modal";

interface CalendarProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, onPrev, onNext }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = date.getFullYear();
  const month = date.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCellsBefore = Array.from({ length: firstDayOfWeek }, () => null);

  let calendarDays = [...emptyCellsBefore, ...days];
  const totalCells = calendarDays.length;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const emptyCellsAfter = Array.from({ length: remainingCells }, () => null);

  calendarDays = [...calendarDays, ...emptyCellsAfter];

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="calendar-header">
        {date.toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        })}
      </div>

      <div className="calendar-names">
        <div className="day-cell cell-week-color">Dom</div>
        <div className="day-cell cell-week-color">Seg</div>
        <div className="day-cell cell-week-color">Ter</div>
        <div className="day-cell cell-week-color">Qua</div>
        <div className="day-cell cell-week-color">Qui</div>
        <div className="day-cell cell-week-color">Sex</div>
        <div className="day-cell cell-week-color">Sáb</div>
      </div>

      <div className="calendar-container">
        <button className="nav-button prev" onClick={onPrev}>
          &lt;
        </button>
        <div className="calendar">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`day-cell ${day === null ? "empty-cell" : "valid-day"}`}
              onClick={() => day !== null && handleDayClick(day)}
            >
              {day !== null ? day : ""}
            </div>
          ))}
        </div>
        <button className="nav-button next" onClick={onNext}>
          &gt;
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default Calendar;
