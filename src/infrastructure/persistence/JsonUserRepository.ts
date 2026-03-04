import { promises as fs } from "node:fs";
import path from "node:path";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

type UserPersistenceModel = {
    id: number;
    dni: string;
    name: string;
    email: string;
}

export class JsonUserRepository implements IUserRepository {

    private filePath = path.resolve(process.cwd(), "data/users.json")

    // Public API

    async findAll(): Promise<User[]> {
        const data = await this.readFile();
        return data.map(this.toDomain);
    }

    async findById(id: number): Promise<User | null> {
        const data = await this.readFile();
        return this.findUserInCollection(data, id);
    }

    async save(user: User): Promise<void> {
        const data = await this.readFile();
        const updated = this.upsertUser(data, user);
        await this.writeFile(updated);
    }

    // Private File Operations

    private async readFile(): Promise<UserPersistenceModel[]> {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    private async writeFile(data: UserPersistenceModel[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    // Private Mapping

    private toDomain = (raw: UserPersistenceModel): User => {
        return new User(
            raw.id,
            raw.dni,
            raw.name,
            raw.email
        );
    };

    private toPersistence(user: User): UserPersistenceModel {
        return {
            id: user.id,
            dni: user.dni,
            name: user.name,
            email: user.email
        };
    }

    // Private Encapsulated Logic

    private findUserInCollection(
        data: UserPersistenceModel[],
        id: number
    ): User | null {

        const found = data.find(u => u.id === id);
        return found ? this.toDomain(found) : null;
    }

    private upsertUser(
        data: UserPersistenceModel[],
        user: User
    ): UserPersistenceModel[] {

        const serialized = this.toPersistence(user);
        const index = data.findIndex(u => u.id === user.id);

        return index === -1
            ? [...data, serialized]
            : data.map(u => u.id === user.id ? serialized : u);
    }
}