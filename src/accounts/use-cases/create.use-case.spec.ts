import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountUseCase } from './create.use-case';
import { PrismaService } from 'src/prisma.service';
import { AccountEntity } from '../entities/account.entity';
import { Decimal } from '@prisma/client/runtime/library';

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
        const dto = { name: 'John', email: 'john.doe@example.com' };
        const expectedAccount = {
            id: 1,
            name: dto.name,
            email: dto.email,
            balance: new Decimal(0),
            currency: 'USD',
            createdAt: new Date("2024-05-13T17:49:13.722Z"),
            updatedAt: new Date("2024-05-13T17:49:13.722Z"),
        };

        jest.spyOn(accountEntity, 'checkIfEmailExists').mockImplementation(() => undefined);
        jest.spyOn(prismaService.account, 'create').mockResolvedValue(expectedAccount);

        const result = await createAccountUseCase.execute(dto);

        expect(accountEntity.checkIfEmailExists).toHaveBeenCalledWith(dto.email);
        expect(prismaService.account.create).toHaveBeenCalledWith({
            data: {
                name: dto.name,
                email: dto.email,
                balance: new Decimal(0),
                currency: 'USD',
            },
        });
        expect(result).toEqual(expectedAccount);
    });
});