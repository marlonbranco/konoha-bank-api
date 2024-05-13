import { Test, TestingModule } from '@nestjs/testing';
import { ChangeEmailAccountUseCase } from './change-email.use-case';
import { PrismaService } from 'src/prisma.service';
import { AccountEntity } from '../entities/account.entity';

describe('ChangeEmailAccountUseCase', () => {
    let changeEmailAccountUseCase: ChangeEmailAccountUseCase;
    let prismaService: PrismaService;
    let accountEntity: AccountEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChangeEmailAccountUseCase,
                { provide: PrismaService, useValue: { account: { update: jest.fn() } } },
                { provide: AccountEntity, useValue: { checkIfEmailExists: jest.fn() } },
            ],
        }).compile();

        changeEmailAccountUseCase = module.get<ChangeEmailAccountUseCase>(ChangeEmailAccountUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
        accountEntity = module.get<AccountEntity>(AccountEntity);
    });

    it('should change an account email', async () => {
        const dto = { email: 'test@example.com' };
        const id = 1;

        jest.spyOn(accountEntity, 'checkIfEmailExists').mockImplementation(() => undefined);
        jest.spyOn(prismaService.account, 'update').mockResolvedValue(undefined);

        await changeEmailAccountUseCase.execute(id, dto);

        expect(accountEntity.checkIfEmailExists).toHaveBeenCalledWith(dto.email);
        expect(prismaService.account.update).toHaveBeenCalledWith({
            where: { id },
            data: { email: dto.email },
        });
    });
});