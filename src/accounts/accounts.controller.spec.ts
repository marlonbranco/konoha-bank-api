import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { CreateAccountUseCase } from './use-cases/create.use-case';
import { GetBalanceUseCase } from './use-cases/get-balance.use-case';
import { GetAccountStatementUseCase } from './use-cases/get-account-statement.use-case';


describe('Integration Tests - AccountsController', () => {
    let accountsController: AccountsController;
    let createAccountUseCase: CreateAccountUseCase;

    let getBalanceUseCase: GetBalanceUseCase;
    let getAccountStatementUseCase: GetAccountStatementUseCase;

    beforeEach(async () => {
        createAccountUseCase = new CreateAccountUseCase();
        createAccountUseCase.execute = jest.fn().mockResolvedValue({
            id: 1,
            name: "John",
            email: "john.doe@email.com",
            balance: 0,
            currency: "USD",
            createdAt: "2024-05-13T17:49:13.722Z",
            updatedAt: "2024-05-13T17:49:13.722Z"
        });
        getBalanceUseCase = new GetBalanceUseCase();
        getBalanceUseCase.execute = jest.fn().mockResolvedValue({ currency: "USD", balance: 100.00 });
        getAccountStatementUseCase = new GetAccountStatementUseCase();
        getAccountStatementUseCase.execute = jest.fn().mockResolvedValue([
            {
                "amount": "300",
                "transaction": {
                    "type": "DEPOSIT",
                    "sender": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    },
                    "receiver": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    }
                }
            },
            {
                "amount": "50",
                "transaction": {
                    "type": "DEPOSIT",
                    "sender": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    },
                    "receiver": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    }
                }
            },
            {
                "amount": "-70",
                "transaction": {
                    "type": "WITHDRAWAL",
                    "sender": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    },
                    "receiver": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    }
                }
            },
            {
                "amount": "-45",
                "transaction": {
                    "type": "TRANSFER",
                    "sender": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    },
                    "receiver": {
                        "name": "John",
                        "email": "jane@email.com"
                    }
                }
            }
        ]);

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountsController],
            providers: [
                { provide: CreateAccountUseCase, useValue: createAccountUseCase },
                { provide: GetBalanceUseCase, useValue: getBalanceUseCase },
                { provide: GetAccountStatementUseCase, useValue: getAccountStatementUseCase },
            ],
        }).compile();

        accountsController = module.get<AccountsController>(AccountsController);
    });

    it('should create an account', async () => {
        const dto = { name: 'John Doe', email: 'john.doe@example.com' };
        const result = await accountsController.create(dto);
        expect(createAccountUseCase.execute).toHaveBeenCalledWith(dto);
        expect(result).toEqual({
            id: 1,
            name: 'John',
            email: 'john.doe@email.com',
            balance: 0,
            currency: 'USD',
            createdAt: "2024-05-13T17:49:13.722Z",
            updatedAt: "2024-05-13T17:49:13.722Z"
        })
    });

    it('should get an account balance', async () => {
        const id = 1;
        const result = await accountsController.getBalance(id);
        expect(getBalanceUseCase.execute).toHaveBeenCalledWith(id);
        expect(result).toEqual({ currency: "USD", balance: 100.00 });
    });

    it('should get an account statement', async () => {
        const id = 1;
        const result = await accountsController.getStatement(id);
        expect(getAccountStatementUseCase.execute).toHaveBeenCalledWith(id);
        expect(result).toEqual([
            {
                "amount": "300",
                "transaction": {
                    "type": "DEPOSIT",
                    "sender": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    },
                    "receiver": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    }
                }
            },
            {
                "amount": "50",
                "transaction": {
                    "type": "DEPOSIT",
                    "sender": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    },
                    "receiver": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    }
                }
            },
            {
                "amount": "-70",
                "transaction": {
                    "type": "WITHDRAWAL",
                    "sender": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    },
                    "receiver": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    }
                }
            },
            {
                "amount": "-45",
                "transaction": {
                    "type": "TRANSFER",
                    "sender": {
                        "name": "Jane",
                        "email": "jane@email.com"
                    },
                    "receiver": {
                        "name": "John",
                        "email": "jane@email.com"
                    }
                }
            }
        ]);
    });
});