import React, { useState, useEffect } from "react";
import Modal from "./Modal";

interface CalendarProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, onPrev, onNext }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarData, setCalendarData] = useState<Record<string, any>>({});

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

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("calendarData") || "{}");
    setCalendarData(data);
  }, [isModalOpen]);

  const handleDayClick = (date: Date) => {
    const today = new Date(new Date().toISOString().split("T")[0]); // Data atual sem horário
    const dateKey = date.toISOString().split("T")[0];
    const existingData = JSON.parse(localStorage.getItem("calendarData") || "{}");

    // Permitir abrir o modal apenas se for o dia atual ou se houver dados contabilizados
    if (dateKey === today.toISOString().split("T")[0] || existingData[dateKey]) {
      setSelectedDate(date); // Define a data selecionada
      setIsModalOpen(true); // Abre o modal
    }
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
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="day-cell empty-cell"></div>;
            }

            const dateKey = new Date(year, month, day).toISOString().split("T")[0];
            const dayData = calendarData[dateKey] || {};

            return (
              <div
                key={index}
                className={`day-cell valid-day`}
                onClick={() => handleDayClick(new Date(year, month, day))}
                style={{
                  position: "relative", // Permite posicionar elementos dentro da célula
                  textAlign: "center", // Centraliza o conteúdo
                  lineHeight: "1.2", // Ajusta o espaçamento interno
                }}
              >
                {/* Ícone de hunts atrás do número */}
                {Object.keys(dayData).length > 0 && (
                  <img
                    src={`${import.meta.env.BASE_URL}images/hunts.png`} // Caminho do ícone de hunts
                    alt="Hunts"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)", // Centraliza o ícone
                      width: "150px", // Aumenta o tamanho do ícone
                      height: "150px", // Aumenta o tamanho do ícone
                      zIndex: 1, // Fica atrás do número do dia
                      opacity: 0.2, // Torna o ícone mais sutil
                    }}
                  />
                )}

                {/* Número do dia */}
                <span
                  style={{
                    position: "relative",
                    zIndex: 2, // Número do dia fica acima do ícone de hunts
                    fontSize: "5rem", // Tamanho do número
                  }}
                >
                  {day}
                </span>

                {/* Ícones dos itens registrados no canto esquerdo, verticalmente */}
                <div
                  style={{
                    position: "absolute", // Posiciona os ícones dentro da célula
                    top: "10px", // Espaçamento do topo da célula
                    left: "10px", // Espaçamento do lado esquerdo da célula
                    display: "flex",
                    flexDirection: "column", // Organiza os ícones verticalmente
                    flexWrap: "wrap",
                    gap: "5px", // Espaçamento entre os ícones
                    height: "90px", // Altura fixa para a coluna de ícones
                  }}
                >
                  {Object.keys(dayData)
                    .filter((key) => key !== "hearth" && dayData[key] > 0)
                    .map((key) => (
                      <img
                        key={key}
                        src={`${import.meta.env.BASE_URL}images/${key}.png`} // Caminho do ícone do item
                        alt={key}
                        style={{
                          width: calendarDays.length === 42 ? "15px" : "20px", // Ajusta o tamanho dos ícones para 15px se houver 6 colunas
                          height: calendarDays.length === 42 ? "15px" : "20px", // Ajusta o tamanho dos ícones para 15px se houver 6 colunas
                        }}
                      />
                    ))}
                </div>              
              </div>
            );
          })}
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
