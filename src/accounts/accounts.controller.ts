import { Controller, Post, Body, Param, Inject, Get, ConflictException, Catch, HttpException } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateAccountDto } from './dto/create-account.dto';
import { CreateAccountUseCase } from './use-cases/create.use-case';
import { GetBalanceUseCase } from './use-cases/get-balance.use-case';
import { GetAccountStatementUseCase } from './use-cases/get-account-statement.use-case';

@ApiTags('accounts')
@Controller('accounts')
@Catch(HttpException)
export class AccountsController {
  @Inject(CreateAccountUseCase)
  private createAccountUseCase: CreateAccountUseCase;

  @Inject(GetBalanceUseCase)
  private getBalanceUseCase: GetBalanceUseCase;

  @Inject(GetAccountStatementUseCase)
  private getAccountStatementUseCase: GetAccountStatementUseCase;

  @Post('/create')
  @ApiOperation({ summary: 'Create account' })
  async create (@Body() data: CreateAccountDto) {
    try {
      return await this.createAccountUseCase.execute(data);
    } catch (err) {
      throw new ConflictException();
    }
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get account balance' })
  getBalance (@Param('id') id: number) {
    return this.getBalanceUseCase.execute(+id);
  }

  @Get(':id/statement')
  @ApiOperation({ summary: 'Get account statment' })
  getStatement (@Param('id') id: number) {
    return this.getAccountStatementUseCase.execute(+id);
  }
}
