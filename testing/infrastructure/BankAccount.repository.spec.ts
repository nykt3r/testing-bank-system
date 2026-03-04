import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { promises as fs } from "node:fs";
import path from "node:path";
import { JsonBankAccountRepository } from "../../src/infrastructure/persistence/JsonBankAccountRepository"
import { BankAccount } from "../../src/domain/entities/BankAccount"

describe("JsonBankAccountRepository", () => {

    const testFilePath = path.resolve(__dirname, "test-bankAccounts.json");
    let repository: JsonBankAccountRepository;

    beforeEach(async () => {
        repository = new JsonBankAccountRepository(testFilePath);
        await fs.writeFile(testFilePath, JSON.stringify([]));
    });

    afterEach(async () => {
        await fs.unlink(testFilePath);
    });

    // save()

    it("should save a new bank account", async () => {
        const account = new BankAccount(1, 10, 1000, []);

        await repository.save(account);

        const result = await repository.findById(1);

        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
        expect(result?.userId).toBe(10);
        expect(result?.balance).toBe(1000);
    });

    it("should update an existing bank account", async () => {
        const account = new BankAccount(1, 10, 1000, []);
        await repository.save(account);

        const updated = new BankAccount(1, 10, 2000, []);
        await repository.save(updated);

        const result = await repository.findById(1);

        expect(result?.balance).toBe(2000);
    });

    // movements persistence

    it("should persist movements correctly", async () => {
        const movements = [
            { type: "deposit", amount: 500 },
            { type: "withdraw", amount: 200 }
        ];

        const account = new BankAccount(1, 10, 1300, movements as any);

        await repository.save(account);

        const result = await repository.findById(1);

        expect(result?.movements).toHaveLength(2);
        expect(result?.movements[0].amount).toBe(500);
    });

    // findById()

    it("should return null if account does not exist", async () => {
        const result = await repository.findById(999);
        expect(result).toBeNull();
    });

    // findAll()

    it("should return all accounts", async () => {
        const acc1 = new BankAccount(1, 10, 1000, []);
        const acc2 = new BankAccount(2, 20, 500, []);

        await repository.save(acc1);
        await repository.save(acc2);

        const result = await repository.findAll();

        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(BankAccount);
    });

    // file handling

    it("should return empty array if file is empty", async () => {
        const result = await repository.findAll();
        expect(result).toEqual([]);
    });

});