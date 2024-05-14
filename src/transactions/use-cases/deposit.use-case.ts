import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { AccountEntity } from "../../accounts/entities/account.entity";
import { SingleWayTransactionDto } from "../dto/single-way-transaction.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { TransactionType } from "@prisma/client";

@Injectable()
export class DepositUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(AccountEntity)
    private accountEntity: AccountEntity;


    async execute (data: SingleWayTransactionDto) {
        const { id, balance } = await this.accountEntity.getAccountData(data.email);

        if (data.amount <= 0) {
            throw new Error('Invalid amount');
        }

        const oldBalance = +balance

        const newBalance = oldBalance + data.amount;

        const transaction = await this.prismaService.transactions.create({
            data: {
                amount: new Decimal(data.amount),
                type: TransactionType.DEPOSIT,
                senderId: id,
                receiverId: id,
                Statements: {
                    create: [
                        {
                            accountId: id,
                            amount: new Decimal(+data.amount),
                            newBalance: new Decimal(newBalance),
                            oldBalance: new Decimal(oldBalance),
                        },
                    ]
                }
            }
        })
        await this.prismaService.account.update({
            where: {
                id
            },
            data: {
                balance: new Decimal(newBalance),
            }
        });
        return transaction.id;
    }
} 