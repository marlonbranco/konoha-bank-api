import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { DepositUseCase } from './use-cases/deposit.use-case';
import { TransferUseCase } from './use-cases/transfer.use-case';
import { WithdrawalUseCase } from './use-cases/withdrawal.use-case';


describe('Integration Tests - TransactionsController', () => {
    let transactionsController: TransactionsController;

    let depositUseCase: DepositUseCase;
    let transferUseCase: TransferUseCase;
    let withdrawalUseCase: WithdrawalUseCase;

    beforeEach(async () => {
        depositUseCase = new DepositUseCase();
        depositUseCase.execute = jest.fn().mockResolvedValue(1);
        transferUseCase = new TransferUseCase();
        transferUseCase.execute = jest.fn().mockResolvedValue(1);
        withdrawalUseCase = new WithdrawalUseCase();
        withdrawalUseCase.execute = jest.fn().mockResolvedValue(1);


        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionsController],
            providers: [
                { provide: DepositUseCase, useValue: depositUseCase },
                { provide: TransferUseCase, useValue: transferUseCase },
                { provide: WithdrawalUseCase, useValue: withdrawalUseCase },
            ],
        }).compile();

        transactionsController = module.get<TransactionsController>(TransactionsController);
    });

    it('should be defined', () => {
        expect(transactionsController).toBeDefined();
    });

    it('should transfer an amount from one account to another', async () => {
        const dto = { emailSender: 'jane@email.com', emailReceiver: 'john@email.com', amount: 100 };
        const result = await transactionsController.transfer(dto);
        expect(result).toEqual(1);
    });

    it('should withdraw an amount from an account', async () => {
        const dto = { email: 'jane@email.com', amount: 100 };
        const result = await transactionsController.withdrawal(dto);
        expect(result).toEqual(1);
    });

    it('should deposit an amount to an account', async () => {
        const dto = { email: 'jane@email.com', amount: 100 };
        const result = await transactionsController.deposit(dto);
        expect(result).toEqual(1);
    });
});