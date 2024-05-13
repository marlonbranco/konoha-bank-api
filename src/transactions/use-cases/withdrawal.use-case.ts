import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { AccountEntity } from "../../accounts/entities/account.entity";
import { SingleWayTransactionDto } from "../dto/single-way-transaction.dto";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class WithdrawalUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(AccountEntity)
    private accountEntity: AccountEntity;

    async execute (data: SingleWayTransactionDto) {
        const { id, balance } = await this.accountEntity.getAccountData(data.email);

        const oldBalance = +balance

        // const isValueSafe = Number.isSafeInteger(oldBalance + data.amount);

        // if (isValueSafe) {
        //     throw new Error('The balance is too high');
        // }
        const newBalance = oldBalance - data.amount;

        await this.prismaService.transactions.create({
            data: {
                amount: new Decimal(data.amount),
                type: 'DEPOSIT',
                senderId: id,
                receiverId: id,
                Statements: {
                    create: [
                        {
                            accountId: id,
                            amount: new Decimal(data.amount),
                            newBalance: new Decimal(newBalance),
                            oldBalance: new Decimal(oldBalance),
                        },
                    ]
                }
            }
        })
        return await this.prismaService.account.update({
            where: {
                id
            },
            data: {
                balance: new Decimal(newBalance),
            }
        });
    }
} 