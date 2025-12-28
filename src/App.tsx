import { useState } from 'react'
import './App.css'
import Calendar from './components/calendar'

function App() {
  return (
    <>
      <div className='viewEvents'>
        <h1>Eventi del Giorno</h1>
        <h2>Nessun evento selezionato</h2>
      </div>
      <div>
        <Calendar />
      </div>
    </>
  )
}

export default App
