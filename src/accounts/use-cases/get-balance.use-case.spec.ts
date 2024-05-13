// import { Test, TestingModule } from '@nestjs/testing';
// import { GetBalanceUseCase } from './get-balance.use-case';
// import { PrismaService } from 'src/prisma.service';

// describe('GetBalanceUseCase', () => {
//     let getBalanceUseCase: GetBalanceUseCase;
//     let prismaService: PrismaService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 GetBalanceUseCase,
//                 { provide: PrismaService, useValue: { account: { findUnique: jest.fn() } } },
//             ],
//         }).compile();

//         getBalanceUseCase = module.get<GetBalanceUseCase>(GetBalanceUseCase);
//         prismaService = module.get<PrismaService>(PrismaService);
//     });

//     it('should get an account balance', async () => {
//         const id = 1;
//         const expectedBalance = 100;

//         jest.spyOn(prismaService.account, 'findUnique').mockResolvedValue({ balance: expectedBalance });

//         const result = await getBalanceUseCase.execute(id);

//         expect(result).toEqual(expectedBalance);
//         expect(prismaService.account.findUnique).toHaveBeenCalledWith({
//             where: { id },
//         });
//     });
// });