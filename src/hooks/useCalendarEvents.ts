import { useState } from 'react';
import {CalendarEvents} from '../types/calendar';

export const useCalendarEvents = () => {
    const[events, setEvents] = useState<CalendarEvents[]>([]);

    const onAddEvent = (date: Date, title: string, note: string) => {
        const newEvent: CalendarEvents = {
            id: Date.now().toString(),
            title:'',
            note: '',
            start: date,
            end: new Date(date.getTime() + 60 * 60 * 1000), // 1 ora dopo
            color: 'red',
            allday: false,
        };
        setEvents(prev => [...prev, newEvent]);
        //qui puoi aggiungere logica per aprire un form di modifica 
    };
    
    return {events, onAddEvent };
};
