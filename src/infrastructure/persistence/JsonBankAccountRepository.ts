import { promises as fs } from "node:fs"
import path from "node:path"
import { IBankAccountRepository } from "../../domain/repositories/IBankAccountRepository"
import { BankAccount } from "../../domain/entities/BankAccount"
import { Movement } from "../../domain/entities/Movement"

type BankAccountPersistenceModel = {
    id: number
    userId: number
    balance: number
    movements: Movement[]
}

export class JsonBankAccountRepository implements IBankAccountRepository {

    private filePath = path.resolve(process.cwd(), "data/bankAccounts.json")

    // Public API

    async findAll(): Promise<BankAccount[]> {
        const data = await this.readFile()
        return data.map(this.toDomain)
    }

    async findById(id: number): Promise<BankAccount | null> {
        const data = await this.readFile()
        return this.findAccountInCollection(data, id)
    }

    async save(account: BankAccount): Promise<void> {
        const data = await this.readFile()
        const updated = this.upsertAccount(data, account)
        await this.writeFile(updated)
    }

    // File Handling

    private async readFile(): Promise<BankAccountPersistenceModel[]> {
        try {
            const raw = await fs.readFile(this.filePath, "utf-8")
            return JSON.parse(raw)
        } catch {
            return []
        }
    }

    private async writeFile(data: BankAccountPersistenceModel[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2))
    }

    // Mapping

    private toDomain = (raw: BankAccountPersistenceModel): BankAccount => {
        return new BankAccount(
            raw.id,
            raw.userId,
            raw.balance,
            raw.movements ?? []
        )
    }

    private toPersistence(account: BankAccount): BankAccountPersistenceModel {
        return {
            id: account.id,
            userId: account.userId,
            balance: account.balance,
            movements: account.movements
        }
    }

    // Encapsulated Collection Logic

    private findAccountInCollection(
        data: BankAccountPersistenceModel[],
        id: number
    ): BankAccount | null {

        const found = data.find(acc => acc.id === id)
        return found ? this.toDomain(found) : null
    }

    private upsertAccount(
        data: BankAccountPersistenceModel[],
        account: BankAccount
    ): BankAccountPersistenceModel[] {

        const serialized = this.toPersistence(account)
        const index = data.findIndex(acc => acc.id === account.id)

        return index === -1
            ? [...data, serialized]
            : data.map(acc =>
                acc.id === account.id ? serialized : acc
            )
    }
}