import { JsonBankAccountRepository } from "./infrastructure/persistence/JsonBankAccountRepository";
import { JsonUserRepository } from "./infrastructure/persistence/JsonUserRepository";
import { BankAccountService } from "./application/services/BankAccountService";
import { User } from "./domain/entities/User";

async function main() {

    const userRepo = new JsonUserRepository();
    const accountRepo = new JsonBankAccountRepository();

    const service = new BankAccountService(accountRepo, userRepo);

    console.log("=== Creating user ===");
    const user = new User(101, "12345678", "Test1", "Test1@email.com");
    await userRepo.save(user);

    console.log("=== Creating account ===");
    await service.createAccount(1, 101, 1000);

    console.log("=== Getting account with user ===");
    const result = await service.getAccountWithUser(1);
    console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);