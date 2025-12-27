import React,{useState} from "react";
import type { DayInfo } from "../types/calendar";
import './Calendar.css';

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState (new Date());         //giornata odierna 
    const [selectDate, setSelectDate] = useState< Date | null> (null);          //giornata selezionata

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
                isSelected: selectDate ? date.toDateString() === selectDate.toDateString() : false,
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
        setSelectDate(day.date);
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
                className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(day)}
            >
            {day.date.getDate()}
            </div>
            ))}
        </div>
    </div>
    );

};
export default Calendar;