import { Test, TestingModule } from '@nestjs/testing';
import { TransferUseCase } from './transfer.use-case';
import { PrismaService } from 'src/prisma.service';
import { AccountEntity } from '../../accounts/entities/account.entity';
import { BothWaysTransactionDto } from '../dto/both-ways-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType } from '@prisma/client';

describe('TransferUseCase', () => {
    let transferUseCase: TransferUseCase;
    let prismaService: PrismaService;
    let accountEntity: AccountEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransferUseCase,
                { provide: PrismaService, useValue: { transactions: { create: jest.fn() }, account: { update: jest.fn() } } },
                { provide: AccountEntity, useValue: { getAccountData: jest.fn() } },
            ],
        }).compile();

        transferUseCase = module.get<TransferUseCase>(TransferUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
        accountEntity = module.get<AccountEntity>(AccountEntity);
    });

    it('should transfer an amount from one account to another', async () => {
        const dto: BothWaysTransactionDto = { emailSender: 'jane.doe@email.com', emailReceiver: 'john.doe@email.com', amount: 100 };
        const senderData = {
            id: 1,
            name: 'Jane Doe',
            email: 'jane.doe@email.com',
            balance: new Decimal(200),
            currency: 'USD',
            createdAt: "2024-05-13T17:49:13.722Z",
            updatedAt: "2024-05-13T17:49:13.722Z"
        };
        const receiverData = {
            id: 2,
            name: 'John Doe',
            email: 'john.doe@email.com',
            balance: new Decimal(100),
            currency: 'USD',
            createdAt: "2024-05-13T17:49:13.722Z",
            updatedAt: "2024-05-13T17:49:13.722Z"
        };

        const transactionData = {
            id: 1,
            senderId: senderData.id,
            receiverId: receiverData.id,
            type: TransactionType.TRANSFER,
            amount: new Decimal(100),
            createdAt: new Date()
        }


        jest.spyOn(accountEntity, 'getAccountData').mockImplementation((email) => {
            if (email === dto.emailSender) {
                return Promise.resolve(senderData);
            } else if (email === dto.emailReceiver) {
                return Promise.resolve(receiverData);
            }
        });
        jest.spyOn(prismaService.transactions, 'create').mockResolvedValue(transactionData);
        jest.spyOn(prismaService.account, 'update').mockResolvedValue(undefined);

        const result = await transferUseCase.execute(dto);

        expect(accountEntity.getAccountData).toHaveBeenCalledWith(dto.emailSender);
        expect(accountEntity.getAccountData).toHaveBeenCalledWith(dto.emailReceiver);
        expect(prismaService.transactions.create).toHaveBeenCalledWith({
            data: {
                senderId: senderData.id,
                receiverId: receiverData.id,
                amount: new Decimal(dto.amount),
                type: 'TRANSFER',
                Statements: {
                    create: [
                        {
                            accountId: senderData.id,
                            amount: new Decimal(-dto.amount),
                            newBalance: new Decimal(+senderData.balance - dto.amount),
                            oldBalance: new Decimal(senderData.balance),
                        },
                        {
                            accountId: receiverData.id,
                            amount: new Decimal(dto.amount),
                            newBalance: new Decimal(+receiverData.balance + dto.amount),
                            oldBalance: new Decimal(receiverData.balance),
                        },
                    ]
                }
            }
        });
        expect(prismaService.account.update).toHaveBeenCalledWith({
            where: { id: senderData.id },
            data: { balance: new Decimal(+senderData.balance - dto.amount) },
        });
        expect(prismaService.account.update).toHaveBeenCalledWith({
            where: { id: receiverData.id },
            data: { balance: new Decimal(+receiverData.balance + dto.amount) },
        });
        expect(result).toEqual(1);
    });

    it('should throw an error if the sender does not have enough balance', async () => {
        const dto: BothWaysTransactionDto = { emailSender: 'john.doe@email.com', emailReceiver: 'jane.doe@email.com', amount: 100 };
        const senderData = {
            id: 1,
            name: 'John Doe',
            email: 'john.doe',
            balance: new Decimal(10),
            currency: 'USD',
            createdAt: "2024-05-13T17:49:13.722Z",
            updatedAt: "2024-05-13T17:49:13.722Z"
        };
        const receiverData = {
            id: 2,
            name: 'Jane Doe',
            email: 'jane.doe',
            balance: new Decimal(100),
            currency: 'USD',
            createdAt: "2024-05-13T17:49:13.722Z",
            updatedAt: "2024-05-13T17:49:13.722Z"
        };
        jest.spyOn(accountEntity, 'getAccountData').mockImplementation((email) => {
            if (email === dto.emailSender) {
                return Promise.resolve(senderData);
            } else if (email === dto.emailReceiver) {
                return Promise.resolve(receiverData);
            }
        });

        try {
            await transferUseCase.execute(dto)
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Insufficient funds');
        }
    });
});