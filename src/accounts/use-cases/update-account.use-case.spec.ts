import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAccountUseCase } from './update-account.use-case';
import { PrismaService } from 'src/prisma.service';

describe('UpdateAccountUseCase', () => {
    let updateAccountUseCase: UpdateAccountUseCase;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateAccountUseCase,
                { provide: PrismaService, useValue: { account: { update: jest.fn() } } },
            ],
        }).compile();

        updateAccountUseCase = module.get<UpdateAccountUseCase>(UpdateAccountUseCase);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should update an account', async () => {
        const id = 1;
        const dto = { name: 'Updated Name' };

        jest.spyOn(prismaService.account, 'update').mockResolvedValue(undefined);

        await updateAccountUseCase.execute(id, dto);

        expect(prismaService.account.update).toHaveBeenCalledWith({
            where: { id },
            data: { name: dto.name },
        });
    });
});