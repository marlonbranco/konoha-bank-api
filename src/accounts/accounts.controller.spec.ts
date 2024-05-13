import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { CreateAccountUseCase } from './use-cases/create.use-case';
import { ChangeEmailAccountUseCase } from './use-cases/change-email.use-case';
import { UpdateAccountUseCase } from './use-cases/update-account.use-case';
import { GetBalanceUseCase } from './use-cases/get-balance.use-case';
import { GetAccountStatementUseCase } from './use-cases/get-account-statement.use-case';

jest.mock('./use-cases/create.use-case');

describe('AccountsController', () => {
    let accountsController: AccountsController;
    let createAccountUseCase: CreateAccountUseCase;

    let changeEmailAccountUseCase: ChangeEmailAccountUseCase;
    let updateAccountUseCase: UpdateAccountUseCase;
    let getBalanceUseCase: GetBalanceUseCase;
    let getAccountStatementUseCase: GetAccountStatementUseCase;

    beforeEach(async () => {
        createAccountUseCase = new CreateAccountUseCase();
        createAccountUseCase.execute = jest.fn();
        changeEmailAccountUseCase = new ChangeEmailAccountUseCase();
        changeEmailAccountUseCase.execute = jest.fn();
        updateAccountUseCase = new UpdateAccountUseCase();
        updateAccountUseCase.execute = jest.fn();
        getBalanceUseCase = new GetBalanceUseCase();
        getBalanceUseCase.execute = jest.fn();
        getAccountStatementUseCase = new GetAccountStatementUseCase();
        getAccountStatementUseCase.execute = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountsController],
            providers: [
                { provide: CreateAccountUseCase, useValue: createAccountUseCase },
                { provide: ChangeEmailAccountUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateAccountUseCase, useValue: { execute: jest.fn() } },
                { provide: GetBalanceUseCase, useValue: { execute: jest.fn() } },
                { provide: GetAccountStatementUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        accountsController = module.get<AccountsController>(AccountsController);
    });

    it('should create an account', () => {
        const dto = { name: 'Test', email: 'test@example.com' };
        accountsController.create(dto);
        expect(createAccountUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('should update an account', () => {
        const id = 1;
        const dto = { name: 'Updated Name' };
        accountsController.updateAccount(id, dto);
        expect(updateAccountUseCase.execute).toHaveBeenCalledWith(id, dto);
    });

    it('should change an account email', () => {
        const id = 1;
        const dto = { email: 'test@example.com' };
        accountsController.changeEmail(id, dto);
        expect(changeEmailAccountUseCase.execute).toHaveBeenCalledWith(id, dto);
    });

    it('should get an account balance', () => {
        const id = 1;
        accountsController.getBalance(id);
        expect(getBalanceUseCase.execute).toHaveBeenCalledWith(id);
    });

    it('should get an account statement', () => {
        const id = 1;
        accountsController.getStatement(id);
        expect(getAccountStatementUseCase.execute).toHaveBeenCalledWith(id);
    });
});