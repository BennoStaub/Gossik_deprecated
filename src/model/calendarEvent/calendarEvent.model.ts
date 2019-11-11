export interface CalendarEvent {
    key?: string;
    userid: string;
    goalid: string;
    startTime: Date;
    endTime: Date;
    title: string;
    allDay: boolean;
}