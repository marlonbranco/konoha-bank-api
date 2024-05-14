import { Test, TestingModule } from '@nestjs/testing';
import { GetAccountStatementUseCase } from './get-account-statement.use-case';
import { PrismaService } from 'src/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

describe('GetAccountStatementUseCase', () => {
    let getAccountStatementUseCase: GetAccountStatementUseCase;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetAccountStatementUseCase,
                { provide: PrismaService, useValue: { statement: { findMany: jest.fn() } } },
            ],
        }).compile();

        getAccountStatementUseCase = module.get<GetAccountStatementUseCase>(GetAccountStatementUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should get an account statement', async () => {
        const id = 1;
        const expectedStatement = [
            {
                id: 1,
                transactionId: 1,
                accountId: 1,
                amount: new Decimal(300),
                newBalance: new Decimal(300),
                oldBalance: new Decimal(0),
                transaction: {
                    type: "DEPOSIT",
                    sender: {
                        name: "Jane",
                        email: "jane@email.com"
                    },
                    receiver: {
                        name: "Jane",
                        email: "jane@email.com"
                    }
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 1,
                transactionId: 2,
                accountId: 1,
                amount: new Decimal(50),
                newBalance: new Decimal(350),
                oldBalance: new Decimal(300),
                transaction: {
                    type: "DEPOSIT",
                    sender: {
                        name: "Jane",
                        email: "jane@email.com"
                    },
                    receiver: {
                        name: "Jane",
                        email: "jane@email.com"
                    }
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 1,
                transactionId: 2,
                accountId: 1,
                amount: new Decimal(-70),
                newBalance: new Decimal(280),
                oldBalance: new Decimal(350),
                transaction: {
                    type: "WITHDRAWAL",
                    sender: {
                        name: "Jane",
                        email: "jane@email.com"
                    },

                    receiver: {
                        name: "Jane",
                        email: "jane@email.com"
                    }
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 1,
                transactionId: 2,
                accountId: 1,
                amount: new Decimal(-45),
                newBalance: new Decimal(235),
                oldBalance: new Decimal(280),
                transaction: {
                    type: "TRANSFER",
                    sender: {
                        name: "Jane",
                        email: "jane@email.com"
                    },
                    receiver: {
                        name: "John",
                        email: "john@email.com"
                    }
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        jest.spyOn(prismaService.statement, 'findMany').mockResolvedValue(expectedStatement);

        const result = await getAccountStatementUseCase.execute(id);

        expect(result).toEqual(expectedStatement);
        expect(prismaService.statement.findMany).toHaveBeenCalledWith({
            select: {
                amount: true,
                transaction: {
                    select: {
                        type: true,
                        sender: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                        receiver: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                    }
                }
            },
            where: {
                accountId: id
            },
        });
    });
});