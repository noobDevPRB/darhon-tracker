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
    elemental: 0,
  });

  useEffect(() => {
    if (isOpen && selectedDate) {
      const dateKey = selectedDate.toISOString().split("T")[0];
      const existingData = JSON.parse(localStorage.getItem("calendarData") || "{}");

      if (existingData[dateKey]) {
        setValues(existingData[dateKey]);
      } else {
        setValues({
          hearth: 0,
          petrificatus: 0,
          tentacle: 0,
          incorruptible: 0,
          mechanil: 0,
          elemental: 0,
        });
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

    const dateKey = selectedDate.toISOString().split("T")[0];
    const existingData = JSON.parse(localStorage.getItem("calendarData") || "{}");

    const updatedData = {
      ...existingData,
      [dateKey]: values,
    };

    localStorage.setItem("calendarData", JSON.stringify(updatedData));
    onClose(); // Fecha o modal após salvar
  };

  if (!isOpen || !selectedDate) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "650px", // Aumenta a largura do modal
          padding: "20px", // Adiciona espaçamento interno
          borderRadius: "8px", // Bordas arredondadas
          display: "flex", // Adiciona flexbox
          flexDirection: "column", // Organiza o conteúdo em coluna
          alignItems: "center", // Centraliza horizontalmente
          justifyContent: "space-between", // Distribui os elementos verticalmente
          minHeight: "450px", // Define uma altura mínima para o modal
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Detalhes do Hunt</h2>
        <p style={{ marginBottom: "20px" }}>{selectedDate.toLocaleDateString("pt-BR")}</p>

        <div
          className="input-group"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // Define duas colunas
            gap: "20px", // Espaçamento entre os itens
            justifyContent: "center", // Centraliza os itens horizontalmente
            alignItems: "center", // Centraliza os itens verticalmente
            marginBottom: "20px", // Adiciona espaçamento entre os itens e os botões
          }}
        >
          {Object.keys(values).map((key) => (
            <div
              key={key}
              className="input-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px", // Espaçamento entre os elementos
              }}
            >
              <img
                src={`/images/${key}.png`} // Substitua pelo caminho correto das imagens
                alt={key}
                style={{ width: "40px", height: "40px" }}
              />
              <input
                type="number"
                value={values[key as keyof typeof values]}
                onChange={(e) =>
                  handleInputChange(key as keyof typeof values, parseInt(e.target.value) || 0)
                }
                style={{
                  width: "70px", // Ajusta a largura do input para manter a proporção
                  textAlign: "center",
                  padding: "5px", // Adiciona espaçamento interno ao input
                  height: "38px", // Define a altura do input para combinar com os botões
                  borderRadius: "8px", // Arredonda as bordas do input
                  border: "1px solid #ccc", // Adiciona uma borda leve
                }}
              />
              <button
                onClick={() => handleDecrement(key as keyof typeof values)}
                style={{
                  backgroundColor: "rgba(255, 121, 97, 0.5)", // Vermelho de pouco contraste
                  color: "white",
                  border: "none",
                  borderRadius: "6px", // Bordas levemente arredondadas
                  height: "50px", // Aumenta a altura do botão
                  width: "50px", // Aumenta a largura do botão
                  cursor: "pointer",
                }}
              >
                -
              </button>
              <button
                onClick={() => handleIncrement(key as keyof typeof values)}
                style={{
                  backgroundColor: "rgba(70, 130, 180, 0.5)", // Azul de pouco contraste
                  color: "white",
                  border: "none",
                  borderRadius: "6px", // Bordas levemente arredondadas
                  height: "50px", // Aumenta a altura do botão
                  width: "50px", // Aumenta a largura do botão
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>

        <div
          className="modal-buttons"
          style={{
            display: "flex",
            justifyContent: "center", // Centraliza os botões
            gap: "10px", // Adiciona espaçamento entre os botões
            marginTop: "20px", // Adiciona margem superior
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: "rgba(255, 99, 71, 0.5)", // Vermelho pastel
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
          <button onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;