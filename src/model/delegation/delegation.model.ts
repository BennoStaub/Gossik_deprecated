export interface Delegation {
    key?: string;
    userid: string;
    goalid: string;
    content: string;
    deadline: Date;
    deadlineid: string;
    active?: boolean;
}