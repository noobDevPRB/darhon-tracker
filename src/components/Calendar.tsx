import React from "react";

interface CalendarProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, onPrev, onNext }) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Obtém o número de dias no mês
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Obtém o dia da semana do primeiro dia do mês (0 = domingo, 1 = segunda-feira, ...)
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Cria um array com os dias do mês
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Adiciona células vazias para alinhar o primeiro dia do mês
  const emptyCellsBefore = Array.from({ length: firstDayOfWeek }, () => null);

  // Combina as células vazias com os dias do mês
  let calendarDays = [...emptyCellsBefore, ...days];

  // Adiciona células vazias no final para completar a última linha, se necessário
  const totalCells = calendarDays.length;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const emptyCellsAfter = Array.from({ length: remainingCells }, () => null);

  calendarDays = [...calendarDays, ...emptyCellsAfter];

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
        <button className="nav-button" onClick={onPrev}>
          &lt;
        </button>
        <div className="calendar">
          {calendarDays.map((day, index) => (
            <div key={index} className={`day-cell ${day === null ? "empty-cell" : ""}`}>
              {day !== null ? day : ""}
            </div>
          ))}
        </div>
        <button className="nav-button" onClick={onNext}>
          &gt;
        </button>
      </div>
    </>
  );
};

export default Calendar;
