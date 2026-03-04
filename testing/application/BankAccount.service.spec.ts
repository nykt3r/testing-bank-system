import { describe, it, expect, beforeEach, vi } from "vitest"
import { BankAccountService } from "../../src/application/services/BankAccountService"
import { BankAccount } from "../../src/domain/entities/BankAccount"
import { User } from "../../src/domain/entities/User"

describe("BankAccountService", () => {

    let accountRepository: any
    let userRepository: any
    let service: BankAccountService

    beforeEach(() => {
        accountRepository = {
            findById: vi.fn(),
            save: vi.fn()
        }

        userRepository = {
            findById: vi.fn()
        }

        service = new BankAccountService(accountRepository, userRepository)
    })

    // Method createAccount TESTING
    it("Should create account if user exists and account does not exist", async () => {
        const user = new User(1, "123", "Test", "test@mail.com")

        userRepository.findById.mockResolvedValue(user)
        accountRepository.findById.mockResolvedValue(null)

        const account = await service.createAccount(10, 1, 1000)

        expect(account).toBeInstanceOf(BankAccount)
        expect(accountRepository.save).toHaveBeenCalledOnce()
    })

    it("Should throw if user does not exist", async () => {
        userRepository.findById.mockResolvedValue(null)

        await expect(
            service.createAccount(10, 1, 1000)
        ).rejects.toThrow("User does not exist")
    })

    it("Should throw if account already exists", async () => {
        const user = new User(1, "123", "Test", "test@mail.com")
        const existingAccount = new BankAccount(10, 1, 100)

        userRepository.findById.mockResolvedValue(user)
        accountRepository.findById.mockResolvedValue(existingAccount)

        await expect(
            service.createAccount(10, 1, 1000)
        ).rejects.toThrow(Error)
    })

    // Method deposit TESTING
    it("Should deposit and return new balance", async () => {
        const account = new BankAccount(1, 1, 100)

        accountRepository.findById.mockResolvedValue(account)

        const balance = await service.deposit(1, 50)

        expect(balance).toBe(150)
        expect(accountRepository.save).toHaveBeenCalledWith(account)
    })

    it("Should throw if deposit account does not exist", async () => {
        accountRepository.findById.mockResolvedValue(null)

        await expect(
            service.deposit(99, 100)
        ).rejects.toThrow("Account not found")
    })

    // Method withdraw TESTING
    it("Should withdraw and return new balance", async () => {
        const account = new BankAccount(1, 1, 200)

        accountRepository.findById.mockResolvedValue(account)

        const balance = await service.withdraw(1, 50)

        expect(balance).toBe(150)
        expect(accountRepository.save).toHaveBeenCalled()
    })

    it("Should throw if withdraw account does not exist", async () => {
        accountRepository.findById.mockResolvedValue(null)

        await expect(
            service.withdraw(99, 100)
        ).rejects.toThrow("Account not found")
    })

    // Method checkBalance TESTING
    it("Should return balance if account exists", async () => {
        const account = new BankAccount(1, 1, 500)

        accountRepository.findById.mockResolvedValue(account)

        const balance = await service.checkBalance(1)

        expect(balance).toBe(500)
        expect(accountRepository.findById).toHaveBeenCalledWith(1)
    })

    it("Should throw if account does not exist when checking balance", async () => {
        accountRepository.findById.mockResolvedValue(null)

        await expect(
            service.checkBalance(999)
        ).rejects.toThrow("Account not found")
    })

    // Method getMovements TESTING
    it("Should return movements if account exists", async () => {
        const account = new BankAccount(1, 1, 100)

        account.deposit(50)
        account.withdraw(30)

        accountRepository.findById.mockResolvedValue(account)

        const movements = await service.getMovements(1)

        expect(movements).toHaveLength(2)
        expect(movements[0].amount).toBe(50)
        expect(movements[1].amount).toBe(30)
        expect(accountRepository.findById).toHaveBeenCalledWith(1)
    })

    it("Should throw if account does not exist when getting movements", async () => {
        accountRepository.findById.mockResolvedValue(null)

        await expect(
            service.getMovements(999)
        ).rejects.toThrow("Account not found")
    })

    // Method getAccountWithUser TESTING
    it("Should return account with user data", async () => {
        const account = new BankAccount(1, 10, 400)
        account.deposit(100)

        const user = new User(10, "123456", "Test", "test@mail.com")

        accountRepository.findById.mockResolvedValue(account)
        userRepository.findById.mockResolvedValue(user)

        const result = await service.getAccountWithUser(1)

        expect(result).toEqual({
            accountId: 1,
            balance: 500,
            movements: account.movements,
            user: {
                id: 10,
                dni: "123456",
                name: "Test",
                email: "test@mail.com"
            }
        })
    })

    it("Should throw if ACCOUNT does not exist when getting account with user", async () => {
        accountRepository.findById.mockResolvedValue(null)

        await expect(
            service.getAccountWithUser(1)
        ).rejects.toThrow("Account not found")
    })

    it("Should throw if USER does not exist when getting account with user", async () => {
        const account = new BankAccount(1, 99, 300)

        accountRepository.findById.mockResolvedValue(account)
        userRepository.findById.mockResolvedValue(null)

        await expect(
            service.getAccountWithUser(1)
        ).rejects.toThrow("User does not exist")
    })
})