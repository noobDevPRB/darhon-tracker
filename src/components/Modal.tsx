import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, selectedDate }) => {
  if (!isOpen || !selectedDate) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Detalhes do Dia</h2>
        <p>Data selecionada: {selectedDate.toLocaleDateString("pt-BR")}</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default Modal;