import { BankAccount } from "../entities/BankAccount";

export interface IBankAccountRepository {

    save(account: BankAccount): Promise<void>;
    findById(id: number): Promise<BankAccount | null>;
    findAll(): Promise<BankAccount[]>;

}