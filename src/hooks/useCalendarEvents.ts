import { useState } from 'react';
import {CalendarEvents} from '../types/calendar';

export const useCalendarEvents = () => {
    const[events, setEvents] = useState<CalendarEvents[]>([]);

    const onAddEvent = (date: Date, title: string, note: string) => {
        const newEvent: CalendarEvents = {
            id: Date.now().toString(),
            title: title,
            note: note,
            start: date,
            end: new Date(date.getTime() + 60 * 60 * 1000), // 1 ora dopo
            color: 'red',
            allday: false,
        };
        setEvents(prev => [...prev, newEvent]);
    };

    const onUpdateEvent = (id: string, updated: Partial<CalendarEvents>) => {
        setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updated } : ev));
    };

    const onDeleteEvent = (id: string) => {
        setEvents(prev => prev.filter(ev => ev.id !== id));
    };
    
    return { events, onAddEvent, onUpdateEvent, onDeleteEvent };
};
