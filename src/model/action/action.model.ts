export interface Action {
    key?: string;
    userid: string;
    goalid: string;
    previousAction: string;
    nextAction: string;
    content: string;
    priority: number;
    deadline: Date;
    deadlineid: string;
    time: number;
    taken: boolean;
}