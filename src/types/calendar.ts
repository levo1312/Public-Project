/**
 *      TIPIZAZIONE CALENDARIO
 *   Ci fornisce la capacita di filtrare i dati rilevanti in modo 
 *   da ridurre errori e bug.
 *  DayInfo => informazioni sulla giornnata 
 *  CalendarEvents => informazioni sugli eventi correlati alle giornate
 *  
 */

export interface DayInfo{
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
}

export interface CalendarEvents{
    id: string;
    title: string;
    note: string;
    start: Date;
    end: Date;
    color?: string;
    allday?: boolean;
}