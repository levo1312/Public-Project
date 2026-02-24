import { useState } from 'react'
import './App.css'
import Calendar from './components/Calendar'
import { useCalendarEvents } from './hooks/useCalendarEvents'

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { events } = useCalendarEvents()
  // Funzione per ottenere eventi per una data
  const getEventsForDate = (date: Date) => {
    return events.filter(event => event.start.toDateString() === date.toDateString())
  }

  const selectedEvents = getEventsForDate(selectedDate)

  return (
    <>
      <div>
        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </div>
    </>
  )
}

export default App
