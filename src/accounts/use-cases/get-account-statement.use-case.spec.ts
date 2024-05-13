// import { Test, TestingModule } from '@nestjs/testing';
// import { GetAccountStatementUseCase } from './get-account-statement.use-case';
// import { PrismaService } from 'src/prisma.service';

// describe('GetAccountStatementUseCase', () => {
//     let getAccountStatementUseCase: GetAccountStatementUseCase;
//     let prismaService: PrismaService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 GetAccountStatementUseCase,
//                 { provide: PrismaService, useValue: { statement: { findMany: jest.fn() } } },
//             ],
//         }).compile();

//         getAccountStatementUseCase = module.get<GetAccountStatementUseCase>(GetAccountStatementUseCase);
//         prismaService = module.get<PrismaService>(PrismaService);
//     });

//     it('should get an account statement', async () => {
//         const id = 1;
//         const expectedStatement = [
//             {
//                 amount: 100,
//                 transaction: {
//                     sender: 'test@example.com',
//                 },
//             },
//         ];

//         jest.spyOn(prismaService.statement, 'findMany').mockResolvedValue(expectedStatement);

//         const result = await getAccountStatementUseCase.execute(id);

//         expect(result).toEqual(expectedStatement);
//         expect(prismaService.statement.findMany).toHaveBeenCalledWith({
//             select: {
//                 amount: true,
//                 transaction: {
//                     select: {
//                         sender: true,
//                     },
//                 },
//             },
//             where: {
//                 accountId: id,
//             },
//         });
//     });
// });