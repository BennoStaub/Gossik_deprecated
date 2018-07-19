export interface Action {
    key?: string;
    userid: string;
    delegated: boolean;
    goalid: string;
    previousAction: string;
    nextAction: string;
    content: string;
    priority: string;
    deadline: string;
    time: string;
}