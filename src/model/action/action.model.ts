export interface Action {
    key?: string;
    userid: string;
    delegated: boolean;
    goalid: string;
    previousAction: string;
    nextAction: string;
    content: string;
    priority: number;
    deadline: string;
    time: number;
}