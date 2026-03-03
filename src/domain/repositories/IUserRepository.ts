import { User } from "../entities/User";

export interface IUserRepository {

    save(user: User): Promise<void>;
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    
}