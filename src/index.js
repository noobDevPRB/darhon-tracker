function generateCalendar(year, month) {
  const calendarContainer = document.querySelector('.calendar');
  calendarContainer.innerHTML = ''; // Limpa o calendário anterior

  const firstDay = new Date(year, month, 1).getDay(); // Dia da semana do primeiro dia do mês (0 = domingo)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total de dias no mês

  // Preencher os dias vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('day-cell', 'empty-cell'); // Classe para células vazias
    calendarContainer.appendChild(emptyCell);
  }

  // Preencher os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day-cell');
    dayCell.textContent = day; // Adiciona o número do dia
    calendarContainer.appendChild(dayCell);
  }

  // Preencher os dias vazios após o último dia do mês (opcional)
  const totalCells = firstDay + daysInMonth;
  const remainingCells = 7 * 6 - totalCells; // Total de células em um calendário de 6 semanas
  for (let i = 0; i < remainingCells; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('day-cell', 'empty-cell');
    calendarContainer.appendChild(emptyCell);
  }
}

// Exemplo de uso
const today = new Date();
generateCalendar(today.getFullYear(), today.getMonth());