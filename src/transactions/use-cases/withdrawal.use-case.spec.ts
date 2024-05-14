import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalUseCase } from './withdrawal.use-case';
import { PrismaService } from 'src/prisma.service';
import { AccountEntity } from '../../accounts/entities/account.entity';
import { SingleWayTransactionDto } from '../dto/single-way-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType } from '@prisma/client';

describe('WithdrawalUseCase', () => {
    let withdrawalUseCase: WithdrawalUseCase;
    let prismaService: PrismaService;
    let accountEntity: AccountEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WithdrawalUseCase,
                { provide: PrismaService, useValue: { transactions: { create: jest.fn() }, account: { update: jest.fn() } } },
                { provide: AccountEntity, useValue: { getAccountData: jest.fn() } },
            ],
        }).compile();

        withdrawalUseCase = module.get<WithdrawalUseCase>(WithdrawalUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
        accountEntity = module.get<AccountEntity>(AccountEntity);
    });

    it('should withdraw an amount from an account', async () => {
        const dto: SingleWayTransactionDto = { email: 'jane.doe@email.com', amount: 100 };
        const accountData = {
            id: 1,
            balance: new Decimal(200),
            name: 'John Doe',
            email: 'john.doe@email.com',
            currency: 'USD',
            createdAt: "2024-05-13T17:49:13.722Z",
            updatedAt: "2024-05-13T17:49:13.722Z"
        };


        const transactionData = {
            id: 1,
            senderId: 1,
            receiverId: 1,
            type: TransactionType.WITHDRAWAL,
            amount: new Decimal(100),
            createdAt: new Date()
        }


        jest.spyOn(accountEntity, 'getAccountData').mockResolvedValue(accountData);
        jest.spyOn(prismaService.transactions, 'create').mockResolvedValue(transactionData);
        jest.spyOn(prismaService.account, 'update').mockResolvedValue(undefined);

        const result = await withdrawalUseCase.execute(dto);

        expect(accountEntity.getAccountData).toHaveBeenCalledWith(dto.email);
        expect(prismaService.transactions.create).toHaveBeenCalledWith({
            data: {
                amount: new Decimal(dto.amount),
                type: 'WITHDRAWAL',
                senderId: accountData.id,
                receiverId: accountData.id,
                Statements: {
                    create: [
                        {
                            accountId: accountData.id,
                            amount: new Decimal(-dto.amount),
                            newBalance: new Decimal(+accountData.balance - dto.amount),
                            oldBalance: new Decimal(accountData.balance),
                        },
                    ]
                }
            }
        });
        expect(prismaService.account.update).toHaveBeenCalledWith({
            where: { id: accountData.id },
            data: { balance: new Decimal(+accountData.balance - dto.amount) },
        });
        expect(result).toEqual(1);
    });
});