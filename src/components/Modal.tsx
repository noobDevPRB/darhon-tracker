import React, { useState } from "react";

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

  if (!isOpen || !selectedDate) return null;

  const handleIncrement = (key: keyof typeof values) => {
    setValues((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const handleDecrement = (key: keyof typeof values) => {
    setValues((prev) => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
  };

  const handleInputChange = (key: keyof typeof values, value: number) => {
    setValues((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  };

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

        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default Modal;