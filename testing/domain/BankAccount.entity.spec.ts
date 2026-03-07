import {it, describe, expect} from "vitest"
import { BankAccount } from "../../src/domain/entities/BankAccount"

describe("BankAccount Entity", () => {

    //POSITIVE CASES
    it("Should return a Bank Account with balance greater than or equal zero", async () => {
        // Arrange
        const account = {
            id: 1,
            userId: 101,
            initialBalance: 200
        }

        // Act
        const acc = new BankAccount(account.id, account.userId, account.initialBalance)

        // Assert
        expect(acc).toBeDefined()
        expect(acc.balance).toBeGreaterThanOrEqual(0)
    })

    it("Should return the balance correctly", async() => {
        const account = {
            id: 1,
            userId: 101,
            initialBalance: 200
        }

        const acc = new BankAccount(account.id, account.userId, account.initialBalance)

        expect(acc.balance).toBe(200)
    })

    it("Should store and return the movements correctly", async() => {
        const account = {
            id: 1,
            userId: 101,
            initialBalance: 200
        }

        const acc = new BankAccount(account.id, account.userId, account.initialBalance)
        acc.deposit(700)
        acc.withdraw(500)
        const mov = acc.movements
        
        expect(mov).toHaveLength(2)
        expect(mov[0].type).toBe('DEPOSIT')
        expect(mov[1].amount).toBe(500)
    })

    it("Should to allow deposit VALID money in an account", async() => {
        const account = {
            id: 1,
            userId: 101,
            initialBalance: 200
        }

        const acc = new BankAccount(account.id, account.userId, account.initialBalance)
        acc.deposit(200)

        expect(acc.balance).greaterThan(200)
    })

    it("Should to allow withdraw VALID money from an account", async() => {
        const account = {
            id: 1,
            userId: 101,
            initialBalance: 200
        }

        const acc = new BankAccount(account.id, account.userId, account.initialBalance)
        acc.withdraw(200)

        expect(acc.balance).toBeGreaterThanOrEqual(0)
    })
    
    //NEGATIVE CASES
    it("Should throw an error if initial balance is negative", async () => {
        const account = {
            id: 1,
            userId: 101,
            initialBalance: -100
        }

        expect(() => 
            new BankAccount(account.id, account.userId, account.initialBalance)
        ).toThrow(Error)
    })

    it("Should throw an error if deposit amount is INVALID (less than or equal to 0)", async () => {
        const account = {
            id: 1,
            userId: 101,
            initialBalance: 100
        }

        const acc = new BankAccount(account.id, account.userId, account.initialBalance)

        expect(() => acc.deposit(-100)).toThrow(Error)
        expect(() => acc.deposit(0)).toThrow(Error)
    })

    it("Should throw an error if withdraw amount is INVALID (less than or equal to 0)", async () => {
        const account = {
            id: 1,
            userId: 101,
            initialBalance: 100
        }

        const acc = new BankAccount(account.id, account.userId, account.initialBalance)

        expect(() => acc.withdraw(-100)).toThrow(Error)
        expect(() => acc.withdraw(0)).toThrow(Error)
    })

    it("Should throw an error if try to withdraw more than the available balance", async () => {
        const account = {
            id: 1,
            userId: 101,
            initialBalance: 100
        }

        const acc = new BankAccount(account.id, account.userId, account.initialBalance)

        expect(() => acc.withdraw(101)).toThrow(Error)
    })
})