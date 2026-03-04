import { IBankAccountRepository } from "../../domain/repositories/IBankAccountRepository"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { BankAccount } from "../../domain/entities/BankAccount"
import { User } from "../../domain/entities/User"

export class BankAccountService {

    constructor(
        private readonly accountRepository: IBankAccountRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async createAccount(id: number, userId: number, initialBalance: number) {
        await this.ensureUserExists(userId)
        await this.ensureAccountDoesNotExist(id)

        const account = new BankAccount(id, userId, initialBalance);
        await this.accountRepository.save(account)

        return account
    }

    async deposit(accountId: number, amount: number) {
        const account = await this.ensureAccountExists(accountId)

        account.deposit(amount)

        await this.accountRepository.save(account)
        return account.balance
    }

    async withdraw(accountId: number, amount: number) {
        const account = await this.ensureAccountExists(accountId)

        account.withdraw(amount)

        await this.accountRepository.save(account)
        return account.balance
    }

    async checkBalance(accountId: number) {
        const account = await this.ensureAccountExists(accountId)
        return account.balance
    }

    async getMovements(accountId: number) {
        const account = await this.ensureAccountExists(accountId)
        return account.movements
    }

    async getAccountWithUser(accountId: number) {
        const account = await this.ensureAccountExists(accountId)
        const user = await this.ensureUserExists(account.userId)

        return {
            accountId: account.id,
            balance: account.balance,
            movements: account.movements,
            user: {
                id: user.id,
                dni: user.dni,
                name: user.name,
                email: user.email
            }
        }
    }

    // Validators
    private async ensureUserExists(userId: number): Promise<User> {
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new Error("User does not exist")
        }
        return user
    }

    private async ensureAccountExists(accountId: number): Promise<BankAccount> {
        const account = await this.accountRepository.findById(accountId)
        if (!account) {
            throw new Error("Account not found")
        }
        return account
    }

    private async ensureAccountDoesNotExist(accountId: number): Promise<void> {
        const existing = await this.accountRepository.findById(accountId)
        if (existing) {
            throw new Error(`Account with ID ${accountId} already exists`)
        }
    }
}