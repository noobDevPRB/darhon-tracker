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

  const isReadOnly = selectedDate
    ? selectedDate < new Date(new Date().toISOString().split("T")[0])
    : false;

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
          width: "650px",
          padding: "20px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "450px",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Detalhes do Hunt</h2>
        <p style={{ marginBottom: "20px" }}>{selectedDate.toLocaleDateString("pt-BR")}</p>

        <div
          className="input-group"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {Object.keys(values).map((key) => (
            <div
              key={key}
              className="input-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={`/images/${key}.png`}
                alt={key}
                style={{ width: "40px", height: "40px" }}
              />
              {isReadOnly ? (
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {values[key as keyof typeof values]}
                </span>
              ) : (
                <>
                  <input
                    type="number"
                    value={values[key as keyof typeof values]}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [key as keyof typeof values]: Math.max(0, parseInt(e.target.value) || 0),
                      }))
                    }
                    style={{
                      width: "70px",
                      textAlign: "center",
                      padding: "5px",
                      height: "38px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        [key as keyof typeof values]: Math.max(0, prev[key as keyof typeof values] - 1),
                      }))
                    }
                    style={{
                      backgroundColor: "rgba(255, 121, 97, 0.5)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      height: "50px",
                      width: "50px",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        [key as keyof typeof values]: prev[key as keyof typeof values] + 1,
                      }))
                    }
                    style={{
                      backgroundColor: "rgba(70, 130, 180, 0.5)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      height: "50px",
                      width: "50px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div
          className="modal-buttons"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: "rgba(255, 99, 71, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "rgba(70, 130, 180, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Salvar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;