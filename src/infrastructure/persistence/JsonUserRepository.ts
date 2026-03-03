import { promises as fs } from "node:fs";
import path from "node:path";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class JsonUserRepository implements IUserRepository {

    private filePath = path.resolve(process.cwd(), "data/users.json");

    private async readFile(): Promise<any[]> {
        const data = await fs.readFile(this.filePath, "utf-8");
        return JSON.parse(data);
    }

    private async writeFile(data: any[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async findAll(): Promise<User[]> {
        const data = await this.readFile();
        return data.map(us => 
            new User(
                us.id, 
                us.dni, 
                us.name, 
                us.email
            )
        );
    }

    async findById(id: number): Promise<User | null> {
        const data = await this.readFile();
        const found = data.find(u => u.id === id);
        if (!found) return null;
        return new User(
            found.id,
            found.dni, 
            found.name, 
            found.email
        );
    }

    async save(user: User): Promise<void> {
        const data = await this.readFile();
        const index = data.findIndex(us => us.id === user.id);
        const serialized = {
            id: user.id,
            dni: user.dni,
            name: user.name,
            email: user.email
        };

        if (index === -1) {
            data.push(serialized);
        } else {
            data[index] = serialized;
        }

        await this.writeFile(data);
    }
}