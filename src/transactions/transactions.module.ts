import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { DepositUseCase } from './use-cases/deposit.use-case';
import { TransferUseCase } from './use-cases/transfer.use-case';
import { WithdrawalUseCase } from './use-cases/withdrawal.use-case';
import { AccountEntity } from 'src/accounts/entities/account.entity';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [DepositUseCase, TransferUseCase, WithdrawalUseCase, AccountEntity, PrismaService],
})
export class TransactionsModule { }
