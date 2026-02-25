import React,{useState, useEffect, type Key} from "react";
import type { DayInfo, CalendarEvents } from "../types/calendar";
import { useCalendarEvents} from "../hooks/useCalendarEvents";
import {Save, Plus, Edit, X, Trash2 } from 'lucide-react';
import './Calendar.css';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState (new Date());         //data odierna 
    const { events, onAddEvent, onUpdateEvent, onDeleteEvent } = useCalendarEvents();    //gestione eventi
    const [showModal, setShowModal] = useState(false);      //stato modale
    const [showMonthPicker, setShowMonthPicker] = useState(false);  // nuovo stato per month picker

    // stato form/modifica
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [formTitle, setFormTitle] = useState('');
    const [formNote, setFormNote] = useState('');

    // Chiude il modal premendo Escape
    useEffect(() => {
      if (!showModal) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowModal(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [showModal]);


    // Chiude il month picker premendo Escape
    useEffect(() => {
      if (!showMonthPicker) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowMonthPicker(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [showMonthPicker]);

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

    // Gestione selezione mese dal picker
    const handleMonthSelect = (month: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
        setShowMonthPicker(false);
    };

//Gestione selezione giorno
    const handleDayClick = (day: DayInfo) => {
        onDateSelect(day.date);
        // apri modal per aggiungere o vedere eventi
        setEditingEventId(null);
        setFormTitle('');
        setFormNote('');
        setShowModal(true);
    };


//gestione aggiunta evento
    const handleAddEvent = (title: string, note: string) => {
        onAddEvent(selectedDate, title, note);
        setShowModal(false);
    };

    const handleUpdateEvent = () => {
        if (!editingEventId) return;
        onUpdateEvent(editingEventId, { title: formTitle, note: formNote, start: selectedDate });
        setEditingEventId(null);
        setFormTitle('');
        setFormNote('');
        setShowModal(false);
    };

    const handleDeleteEvent = (id?: string) => {
        const targetId = id || editingEventId;
        if (!targetId) return;
        onDeleteEvent(targetId);
        setEditingEventId(null);
        setFormTitle('');
        setFormNote('');
        setShowModal(false);
    };

    const openEditFor = (event: CalendarEvents) => {
        setEditingEventId(event.id);
        setFormTitle(event.title);
        setFormNote(event.note);
        setShowModal(true);
    };




//visualizzazione calendario
    return(
    <div className ="calendar">
        <div className ="calendar-header">
            <button onClick={previusMonth}>&lt;</button>
            <h2 onClick={() => setShowMonthPicker(!showMonthPicker)} style={{cursor: 'pointer'}}>
              {currentDate.toLocaleDateString('it-IT', {month: 'long', year: 'numeric'})}
            </h2>
            <button onClick={nextMonth}>&gt;</button>
        </div>

        {/* Month Picker Modal */}
        {showMonthPicker && (
            <div className="modal-overlay" onClick={() => setShowMonthPicker(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>{currentDate.getFullYear()}</h3>
                    <div className="months-grid">
                        {['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'].map((month, index) => (
                            <button
                                key={index}
                                className={`month-button ${currentDate.getMonth() === index ? 'active' : ''}`}
                                onClick={() => handleMonthSelect(index)}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                    <button className="close-button" type="button" aria-label="Chiudi" onClick={() => setShowMonthPicker(false)}> <X size={20}/></button>
                </div>
            </div>
        )}


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
            <div className="modal-overlay" onClick={()=> setShowModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>Eventi:{selectedDate.toLocaleDateString('it-IT')}</h3>
                    {events.filter(event => event.start.toDateString() === selectedDate.toDateString()).length > 0 ? (
                        <ul>
                            {events.filter(event => event.start.toDateString() === selectedDate.toDateString()).map(event =>(
                                <li key={event.id}>
                                    <span>{event.title} - {event.note}</span>
                                    <div className="event-actions">
                                        <button type="button" className="event-btn" onClick={() => openEditFor(event)}> <Edit size={11}/> </button>
                                        <button type="button" className="event-btn delete" onClick={() => handleDeleteEvent(event.id)}> <Trash2 size={11}/></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nessun Evento</p>
                    )}
                    {/*gesttione del form per aggiungere new evento*/}
                    <button className="close-button" type="button" aria-label="Chiudi" onClick={() => setShowModal(false)}>X</button>
                    <h4>{editingEventId ? 'Modifica Evento:' : 'Aggiungi Evento:'}</h4>
                    <form noValidate onSubmit={(e) => {
                        e.preventDefault();
                        if (editingEventId) {
                            handleUpdateEvent();
                            return;
                        }

                        if(!formTitle?.trim() && !formNote?.trim()){
                            return;
                        }

                        handleAddEvent(formTitle?.trim() || "", formNote?.trim() || "");
                        setFormTitle('');
                        setFormNote('');
                    }}>
                        <input name = "title" type="text" placeholder="aggiungi evento..." required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                        <br/>
                        <input name = "note" type="text" placeholder="descrizione..." value={formNote} onChange={(e) => setFormNote(e.target.value)} />
                        
                        {editingEventId ? (
                            <>
                                <button className="save-button" type="submit"><Save size={11}/></button>
                                <button className="event-btn delete" type="button" onClick={() => handleDeleteEvent()}>Elimina</button>
                            </>
                        ) : (
                            <button className="add-button" type="submit"><Plus size={20}/></button>
                        )}
                    </form>
                    

                </div>
            </div>
        )}
    </div>
    );
};
export default Calendar;