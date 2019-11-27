export interface Action {
    key?: string;
    userid: string;
    goalid: string;
    previousAction: string;
    nextAction: string;
    content: string;
    priority: number;
    deadline: any;
    deadlineid: string;
    time: number;
    taken: boolean;
    active?: boolean;
}