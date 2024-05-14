import { Test, TestingModule } from '@nestjs/testing';
import { DepositUseCase } from './deposit.use-case';
import { PrismaService } from 'src/prisma.service';
import { AccountEntity } from '../../accounts/entities/account.entity';
import { SingleWayTransactionDto } from '../dto/single-way-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType } from '@prisma/client';

describe('DepositUseCase', () => {
    let depositUseCase: DepositUseCase;
    let prismaService: PrismaService;
    let accountEntity: AccountEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DepositUseCase,
                { provide: PrismaService, useValue: { transactions: { create: jest.fn() }, account: { update: jest.fn() } } },
                { provide: AccountEntity, useValue: { getAccountData: jest.fn() } },
            ],
        }).compile();

        depositUseCase = module.get<DepositUseCase>(DepositUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
        accountEntity = module.get<AccountEntity>(AccountEntity);
    });

    it('should deposit an amount to an account', async () => {
        const dto: SingleWayTransactionDto = { email: 'jane.doe@email.com', amount: 100 };
        const accountData = {
            id: 1,
            balance: new Decimal(0),
            name: 'Jane Doe',
            email: 'jane.doe@email.com',
            currency: 'USD',
            createdAt: "2024-05-13T17:49:13.722Z",
            updatedAt: "2024-05-13T17:49:13.722Z"
        };

        const transactionData = {
            id: 1,
            senderId: 1,
            receiverId: 1,
            type: TransactionType.DEPOSIT,
            amount: new Decimal(100),
            createdAt: new Date()
        }

        const newBalance = +accountData.balance + dto.amount;

        jest.spyOn(accountEntity, 'getAccountData').mockResolvedValue(accountData);
        jest.spyOn(prismaService.transactions, 'create').mockResolvedValue(transactionData);
        jest.spyOn(prismaService.account, 'update').mockResolvedValue(undefined);

        const result = await depositUseCase.execute(dto);

        expect(accountEntity.getAccountData).toHaveBeenCalledWith(dto.email);
        expect(prismaService.transactions.create).toHaveBeenCalledWith({
            data: {
                amount: new Decimal(dto.amount),
                type: TransactionType.DEPOSIT,
                senderId: accountData.id,
                receiverId: accountData.id,
                Statements: {
                    create: [
                        {
                            accountId: accountData.id,
                            amount: new Decimal(dto.amount),
                            newBalance: new Decimal(newBalance),
                            oldBalance: new Decimal(0),
                        },
                    ]
                }
            }
        });
        expect(prismaService.account.update).toHaveBeenCalledWith({
            where: { id: accountData.id },
            data: { balance: new Decimal(newBalance) },
        });

        expect(result).toEqual(transactionData.id);
    });
});