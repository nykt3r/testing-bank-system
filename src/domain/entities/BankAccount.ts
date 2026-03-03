import { Movement, MovementType } from "./Movement";

export class BankAccount {

    private _balance: number;
    private _movements: Movement[];

    constructor(
        public readonly id: number, 
        public readonly userId: number, 
        initialBalance: number,
        movements: Movement[] = []
    ) {

        this.validateInitialBalance(initialBalance)
        this._balance = initialBalance;
        this._movements = movements;
    }

    get balance(): number {
        return this._balance;
    }

    get movements(): Movement[] {
        return [...this._movements];
    }

    deposit(amount: number): void {
        this.validatePositiveAmount(amount)
        this._balance += amount;
        this._movements.push({
            id: Date.now(),
            type: MovementType.DEPOSIT,
            amount,
            date: new Date()
        });
    }

    withdraw(amount: number): void {
        this.validatePositiveAmount(amount)
        this.validateFunds(amount)
        this._balance -= amount;
        this._movements.push({
            id: Date.now(),
            type: MovementType.WITHDRAW,
            amount,
            date: new Date()
        });
    }
    
    // Validators
    private validateInitialBalance(amount: number): void {
        if (amount < 0) {
            throw new Error("Initial balance cannot be negative");
        }
    }

    private validatePositiveAmount(amount: number): void {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0")
        }
    }

    private validateFunds(amount: number): void {
        if (this.balance < amount) {
            throw new Error("Insufficient balance")
        }
    }
}