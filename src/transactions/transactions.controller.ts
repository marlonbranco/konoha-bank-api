import { Controller, Post, Body, Inject } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DepositUseCase } from './use-cases/deposit.use-case';
import { TransferUseCase } from './use-cases/transfer.use-case';
import { WithdrawalUseCase } from './use-cases/withdrawal.use-case';
import { SingleWayTransactionDto } from './dto/single-way-transaction.dto';
import { BothWaysTransactionDto } from './dto/both-ways-transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  @Inject(DepositUseCase)
  private depositUseCase: DepositUseCase;

  @Inject(TransferUseCase)
  private transferUseCase: TransferUseCase;

  @Inject(WithdrawalUseCase)
  private withdrawalUseCase: WithdrawalUseCase;

  @Post('/deposit')
  @ApiOperation({ summary: 'Deposit to an account' })
  deposit (@Body() data: SingleWayTransactionDto) {
    return this.depositUseCase.execute(data);
  }

  @Post('/transfer')
  @ApiOperation({ summary: 'Transfer between two accounts' })
  transfer (@Body() data: BothWaysTransactionDto) {
    return this.transferUseCase.execute(data);
  }

  @Post('/withdrawal')
  @ApiOperation({ summary: 'Withdrawal from an account' })
  withdrawal (@Body() data: SingleWayTransactionDto) {
    return this.withdrawalUseCase.execute(data);
  }
}
