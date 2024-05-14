import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { CreateAccountUseCase } from './use-cases/create.use-case';
import { AccountEntity } from './entities/account.entity';
import { GetBalanceUseCase } from './use-cases/get-balance.use-case';
import { PrismaService } from 'src/prisma.service';
import { GetAccountStatementUseCase } from './use-cases/get-account-statement.use-case';

@Module({
  controllers: [AccountsController],
  providers: [
    CreateAccountUseCase,
    GetBalanceUseCase,
    GetAccountStatementUseCase,
    AccountEntity,
    PrismaService
  ],

})
export class AccountsModule { }
