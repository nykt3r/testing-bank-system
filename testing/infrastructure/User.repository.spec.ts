import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { promises as fs } from "node:fs"
import path from "node:path"
import { JsonUserRepository } from "../../src/infrastructure/persistence/JsonUserRepository"
import { User } from "../../src/domain/entities/User"

describe("JsonUserRepository", () => {

    const testFilePath = path.resolve(__dirname, "test-users.json")
    let repository: JsonUserRepository;

    beforeEach(async () => {
        repository = new JsonUserRepository(testFilePath);
        await fs.writeFile(testFilePath, JSON.stringify([]));
    });

    afterEach(async () => {
        await fs.unlink(testFilePath);
    });

    // save()

    it("should save a new user", async () => {
        const user = new User(1, "123456", "Juan", "juan@test.com");

        await repository.save(user);

        const result = await repository.findById(1);

        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
        expect(result?.name).toBe("Juan");
    });

    it("should update an existing user", async () => {
        const user = new User(1, "123456", "Juan", "juan@test.com");
        await repository.save(user);

        const updated = new User(1, "123456", "Juan Updated", "juan@test.com");
        await repository.save(updated);

        const result = await repository.findById(1);

        expect(result?.name).toBe("Juan Updated");
    });

    // findById()

    it("should return null if user does not exist", async () => {
        const result = await repository.findById(999);
        expect(result).toBeNull();
    });

    // findAll()

    it("should return all users", async () => {
        const user1 = new User(1, "111", "User1", "u1@test.com");
        const user2 = new User(2, "222", "User2", "u2@test.com");

        await repository.save(user1);
        await repository.save(user2);

        const result = await repository.findAll();

        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(User);
    });

    // file handling

    it("should return empty array if file is empty", async () => {
        const result = await repository.findAll();
        expect(result).toEqual([]);
    });
    
});