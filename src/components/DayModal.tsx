import React, { useState } from 'react'

interface DayModalProps {
  date: Date | null
  onClose: () => void
}

const DayModal: React.FC<DayModalProps> = ({ date, onClose }) => {
  const [values, setValues] = useState({
    heart: 0,
    petrificatus: 0,
    tentacle: 0,
    elemental: 0,
    incorruptible: 0,
    mechanil: 0,
  })

  const handleIncrement = (key: string) => {
    setValues((prev) => ({ ...prev, [key]: prev[key] + 1 }))
  }

  const handleDecrement = (key: string) => {
    setValues((prev) => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }))
  }

  const handleInputChange = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: Math.max(0, value) }))
  }

  const handleSave = () => {
    const storedData = JSON.parse(localStorage.getItem('dayData') || '{}')
    const formattedDate = date?.toISOString().split('T')[0]
    localStorage.setItem(
      'dayData',
      JSON.stringify({ ...storedData, [formattedDate]: values })
    )
    onClose()
  }

  if (!date) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Data: {date.toLocaleDateString()}</h2>
        {Object.keys(values).map((key) => (
          <div key={key} className="input-group">
            <label>{key}</label>
            <button onClick={() => handleDecrement(key)}>-</button>
            <input
              type="number"
              value={values[key]}
              onChange={(e) => handleInputChange(key, Number(e.target.value))}
            />
            <button onClick={() => handleIncrement(key)}>+</button>
          </div>
        ))}
        <button className="save-button" onClick={handleSave}>
          Salvar
        </button>
        <button className="close-button" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  )
}

export default DayModal