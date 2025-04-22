import React, { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, selectedDate }) => {
  const [values, setValues] = useState({
    hearth: 0,
    petrificatus: 0,
    tentacle: 0,
    incorruptible: 0,
    mechanil: 0,
  });

  // Carrega os valores do localStorage quando o modal é aberto
  useEffect(() => {
    if (isOpen && selectedDate) {
      const dateKey = selectedDate.toISOString().split("T")[0]; // Formata a data como "YYYY-MM-DD"
      const existingData = JSON.parse(localStorage.getItem("calendarData") || "{}");

      if (existingData[dateKey]) {
        setValues(existingData[dateKey]); // Carrega os valores existentes
      } else {
        setValues({
          hearth: 0,
          petrificatus: 0,
          tentacle: 0,
          incorruptible: 0,
          mechanil: 0,
        }); // Reseta os valores caso não exista
      }
    }
  }, [isOpen, selectedDate]);

  const handleIncrement = (key: keyof typeof values) => {
    setValues((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const handleDecrement = (key: keyof typeof values) => {
    setValues((prev) => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
  };

  const handleInputChange = (key: keyof typeof values, value: number) => {
    setValues((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  };

  const handleSave = () => {
    if (!selectedDate) return;

    const dateKey = selectedDate.toISOString().split("T")[0]; // Formata a data como "YYYY-MM-DD"
    const existingData = JSON.parse(localStorage.getItem("calendarData") || "{}");

    // Atualiza ou cria o objeto no localStorage
    const updatedData = {
      ...existingData,
      [dateKey]: values,
    };

    localStorage.setItem("calendarData", JSON.stringify(updatedData));
    alert("Dados salvos com sucesso!");
  };

  if (!isOpen || !selectedDate) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Detalhes do Dia</h2>
        <p>Data selecionada: {selectedDate.toLocaleDateString("pt-BR")}</p>

        <div className="input-group">
          {Object.keys(values).map((key) => (
            <div key={key} className="input-row">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <button onClick={() => handleDecrement(key as keyof typeof values)}>-</button>
              <button onClick={() => handleIncrement(key as keyof typeof values)}>+</button>
              <input
                type="number"
                value={values[key as keyof typeof values]}
                onChange={(e) =>
                  handleInputChange(key as keyof typeof values, parseInt(e.target.value) || 0)
                }
              />
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button onClick={onClose}>Fechar</button>
          <button onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;