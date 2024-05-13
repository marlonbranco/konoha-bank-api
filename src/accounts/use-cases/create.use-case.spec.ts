import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountUseCase } from './create.use-case';
import { PrismaService } from 'src/prisma.service';
import { AccountEntity } from '../entities/account.entity';

describe('CreateAccountUseCase', () => {
    let createAccountUseCase: CreateAccountUseCase;
    let prismaService: PrismaService;
    let accountEntity: AccountEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateAccountUseCase,
                { provide: PrismaService, useValue: { account: { create: jest.fn() } } },
                { provide: AccountEntity, useValue: { checkIfEmailExists: jest.fn() } },
            ],
        }).compile();

        createAccountUseCase = module.get<CreateAccountUseCase>(CreateAccountUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
        accountEntity = module.get<AccountEntity>(AccountEntity);
    });

    it('should create an account', async () => {
        const dto = { name: 'Test', email: 'test@example.com' };
        const expectedAccount = {
            name: dto.name,
            email: dto.email,
            balance: 0,
            currency: 'USD',
        };

        jest.spyOn(accountEntity, 'checkIfEmailExists').mockImplementation(() => undefined);
        jest.spyOn(prismaService.account, 'create').mockResolvedValue(undefined);

        await createAccountUseCase.execute(dto);

        expect(accountEntity.checkIfEmailExists).toHaveBeenCalledWith(dto.email);
        expect(prismaService.account.create).toHaveBeenCalledWith({
            data: {
                name: dto.name,
                email: dto.email,
                balance: 0,
                currency: 'USD',
            },
        });
        expect(prismaService.account.create).toHaveBeenCalledWith({
            data: expectedAccount,
        });
    });
});