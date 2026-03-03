import { IBankAccountRepository } from "../../domain/repositories/IBankAccountRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { BankAccount } from "../../domain/entities/BankAccount";

export class BankAccountService {

    constructor(
        private accountRepository: IBankAccountRepository,
        private userRepository: IUserRepository
    ) {}

    async createAccount(id: number, userId: number, initialBalance: number) {

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User does not exist");
        }

        const existing = await this.accountRepository.findById(id);
        if (existing) {
            throw new Error(`Account with ID ${id} already exists`);
        }

        const account = new BankAccount(id, userId, initialBalance);
        await this.accountRepository.save(account);
        return account;
    }

    async deposit(accountId: number, amount: number) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new Error("Account not found");
        }
        account.deposit(amount);
        await this.accountRepository.save(account);
        return account.balance;
    }

    async withdraw(accountId: number, amount: number) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new Error("Account not found");
        }
        account.withdraw(amount);
        await this.accountRepository.save(account);
        return account.balance;
    }

    async checkBalance(accountId: number) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new Error("Account not found");
        }
        return account.balance;
    }

    async getMovements(accountId: number) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new Error("Account not found");
        }
        return account.movements;
    }

    async getAccountWithUser(accountId: number) {

    const account = await this.accountRepository.findById(accountId);
    if (!account) throw new Error("Account not found");

    const user = await this.userRepository.findById(account.userId);
    if (!user) throw new Error("User not found");

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
    };
}
}