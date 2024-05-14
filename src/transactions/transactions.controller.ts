import { Controller, Post, Body, Inject, HttpException, Catch, BadRequestException, HttpStatus } from '@nestjs/common';
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
@Catch(HttpException)
export class TransactionsController {
  @Inject(DepositUseCase)
  private depositUseCase: DepositUseCase;

  @Inject(TransferUseCase)
  private transferUseCase: TransferUseCase;

  @Inject(WithdrawalUseCase)
  private withdrawalUseCase: WithdrawalUseCase;

  @Post('/deposit')
  @ApiOperation({ summary: 'Deposit to an account' })
  async deposit (@Body() data: SingleWayTransactionDto) {
    try {
      return await this.depositUseCase.execute(data);
    } catch (err) {
      throw new BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message: err.message });
    }
  }

  @Post('/transfer')
  @ApiOperation({ summary: 'Transfer between two accounts' })
  async transfer (@Body() data: BothWaysTransactionDto) {
    try {
      return await this.transferUseCase.execute(data);
    } catch (err) {
      throw new BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message: err.message });
    }
  }

  @Post('/withdrawal')
  @ApiOperation({ summary: 'Withdrawal from an account' })
  async withdrawal (@Body() data: SingleWayTransactionDto) {
    try {
      return await this.withdrawalUseCase.execute(data);
    } catch (err) {
      throw new BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message: err.message });
    }
  }
}
