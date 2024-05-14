import { Test, TestingModule } from '@nestjs/testing';
import { GetBalanceUseCase } from './get-balance.use-case';
import { PrismaService } from 'src/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

describe('GetBalanceUseCase', () => {
    let getBalanceUseCase: GetBalanceUseCase;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetBalanceUseCase,
                { provide: PrismaService, useValue: { account: { findUnique: jest.fn() } } },
            ],
        }).compile();

        getBalanceUseCase = module.get<GetBalanceUseCase>(GetBalanceUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should get an account balance', async () => {
        const id = 1;
        const expectedBalance = 100.33;
        const currency = "USD";

        jest.spyOn(prismaService.account, 'findUnique')
            .mockResolvedValue({
                id,
                name: "John",
                email: "john.doe@email.com",
                balance: new Decimal(expectedBalance),
                currency,
                createdAt: new Date(),
                updatedAt: new Date()
            });

        const result = await getBalanceUseCase.execute(id);

        expect(prismaService.account.findUnique).toHaveBeenCalledWith({
            select: {
                email: true,
                currency: true,
                balance: true
            },
            where: { id },
        });
        expect(result).toEqual({ currency, balance: expectedBalance });

    });
});