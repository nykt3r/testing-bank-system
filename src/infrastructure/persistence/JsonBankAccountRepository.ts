import { promises as fs } from "node:fs";
import path from "node:path";
import { IBankAccountRepository } from "../../domain/repositories/IBankAccountRepository";
import { BankAccount } from "../../domain/entities/BankAccount";

export class JsonBankAccountRepository implements IBankAccountRepository {

    private filePath = path.resolve(process.cwd(), "data/bankAccounts.json");

    private async readFile(): Promise<any[]> {
        const data = await fs.readFile(this.filePath, "utf-8");
        return JSON.parse(data);
    }

    private async writeFile(data: any[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async findAll(): Promise<BankAccount[]> {
        const data = await this.readFile();
        return data.map(acc =>
            new BankAccount(
                acc.id, 
                acc.userId, 
                acc.balance, 
                acc.movements
            )
        );
    }

    async findById(id: number): Promise<BankAccount | null> {
        const data = await this.readFile();
        const found = data.find(acc => acc.id === id);
        if (!found) return null;
        const account = new BankAccount(
            found.id, 
            found.userId, 
            found.balance, 
            found.movements || []
        );
        return account;
    }

    async save(account: BankAccount): Promise<void> {
        const data = await this.readFile();
        const index = data.findIndex(acc => acc.id === account.id);
        const serialized = {
            id: account.id,
            userId: account.userId,
            balance: account.balance,
            movements: account.movements
        };

        if (index === -1) {
            data.push(serialized);
        } else {
            data[index] = serialized;
        }
        
        await this.writeFile(data);
    }
}
