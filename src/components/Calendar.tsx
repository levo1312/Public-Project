import React,{useState} from "react";
import type { DayInfo } from "../types/calendar";
import { useCalendarEvents} from "../hooks/useCalendarEvents";
import './Calendar.css';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState (new Date());         //data odierna 
    const { events, onAddEvent } = useCalendarEvents();    //gestione eventi
    const [showModal, setShowmodal] = useState(false);      //stato modale


    //funzione per generare i giorni del mese 
    const generDays = () :DayInfo[]=>{
        const year =currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());        //per farlo iniziare la domenica


        const days: DayInfo[] = [];
        const today = new Date;

        for(let i=0; i<42; i++){
            const date=new Date(startDate);
            date.setDate(startDate.getDate() + i);

            days.push({
                date,
                isCurrentMonth: date.getMonth() === month,
                isToday: date.toDateString() === today.toDateString(),
                isSelected: selectedDate ? date.toDateString() === selectedDate.toDateString() : false,
            });
        }

        return days;
    };

    const days = generDays();

//funzioni per navigazione tra i mesi
    const previusMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };


    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };


//Gestione selezione giorno
    const handleDayClick = (day: DayInfo) => {
        onDateSelect(day.date);
        setShowmodal(true);
    };


//gestione aggiunta evento
    const handleAddEvent = (title: string, note: string) => {
        onAddEvent(selectedDate, title, note);
        setShowmodal(false);
    };


//visualizzazione calendario
    return(
    <div className ="calendar">
        <div className ="calendar-header">
            <button onClick={previusMonth}>&lt;</button>
            <h2>{currentDate.toLocaleDateString('it-IT', {month: 'long', year: 'numeric'})}</h2>
            <button onClick={nextMonth}>&gt;</button>
        </div>

        <div className ="calendar-grid">
                {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day =>(
                    <div key={day} className="calendar-day-header">
                        {day}
                    </div>
                ))}
                {days.map((day, index)=>(
                    <div
                        key={index}
                        className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''} ${events.some(event => event.start.toDateString() === day.date.toDateString()) ? 'has-events' : ''}`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day.date.getDate()}
                        {events.filter(event => event.start.toDateString() === day.date.toDateString()).length > 0 && (
                            <div className="event-indicator">
                                {events.filter(event => event.start.toDateString() === day.date.toDateString()).length}
                            </div>
                        )}
                    </div>
                ))}
        </div>
{       /*visualizzazione modal addEvent */}
        {showModal && (
            <div className="modal-overlay" onClick={()=> setShowmodal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>Eventi:{selectedDate.toLocaleDateString('it-IT')}</h3>
                    {events.filter(event => event.start.toDateString() === selectedDate.toDateString()).length > 0 ? (
                        <ul>
                            {events.filter(event => event.start.toDateString() === selectedDate.toDateString()).map(event =>(
                                <li key={event.id}>{event.title} - {event.note}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nessun evento</p>
                    )}
                    {/*gesttione del form per aggiungere new evento, gestire l'obbligo dei riempimento di tutti i campi*/}
                    <button className="close-botton" onClick={() => setShowmodal(false)}>X</button>
                    <h4>Aggiungi Evento:</h4>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const title = formData.get('title') as string;
                        const note = formData.get('note') as string;
                        handleAddEvent(title, note);
                    }}>
                        <input name = "title" type="text" placeholder="aggiungi evento..." required />
                        <br/>
                        <input name = "note" type="text" placeholder="descrizione..." required />
                        <button className="add-botton" type="submit">+</button>
                    </form>
                    

                </div>
            </div>
        )}
    </div>
    );
};
export default Calendar;