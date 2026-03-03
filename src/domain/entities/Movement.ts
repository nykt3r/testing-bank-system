export enum MovementType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW"
}

export interface Movement {
    id: number;
    type: MovementType;
    amount: number;
    date: Date;
}