import { describe, it, expect, vi, beforeEach } from "vitest"
import { BankAccountService } from "../../src/application/services/BankAccountService"

describe("BankAccountService", () => {

    let accountRepo: any
    let userRepo: any
    let service: BankAccountService

    beforeEach(() => {
        accountRepo = {
            findById: vi.fn(),
            save: vi.fn()
        }

        userRepo = {
            findById: vi.fn()
        }

        service = new BankAccountService(accountRepo, userRepo)
    })

    // POSITIVE CASES
    it("Should create account successfully", async () => {
        userRepo.findById.mockResolvedValue({ id: 1 })
        accountRepo.findById.mockResolvedValue(null)
        accountRepo.save.mockResolvedValue(undefined)

        const result = await service.createAccount(1, 1, 100)

        expect(result).toBeDefined()
        expect(result.balance).toBe(100)
        expect(accountRepo.save).toHaveBeenCalledTimes(1)
    })

})