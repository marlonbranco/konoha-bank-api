import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaService } from './prisma.service';

@Module({
    imports: [AccountsModule, TransactionsModule],
    providers: [PrismaService],
})
export class AppModule { }