import React, { useState } from 'react'
import Header from './components/Header'
import Calendar from './components/Calendar'

const App = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <div>
      <Header />
      <Calendar
        date={currentDate}
        onPrev={goToPreviousMonth}
        onNext={goToNextMonth}
      />
    </div>
  )
}

export default App
