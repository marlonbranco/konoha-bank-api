import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { AccountEntity } from "../../accounts/entities/account.entity";
import { BothWaysTransactionDto } from "../dto/both-ways-transaction.dto";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class TransferUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(AccountEntity)
    private accountEntity: AccountEntity;


    async execute (data: BothWaysTransactionDto) {
        const { id: senderId, balance: senderBalance } = await this.accountEntity.getAccountData(data.emailSender);
        const { id: receiverId, balance: receiverBalance } = await this.accountEntity.getAccountData(data.emailReceiver);

        if (senderId === receiverId) {
            throw new Error('You can not transfer money to yourself');
        }

        const senderOldBalance = +senderBalance

        if (senderOldBalance < data.amount) {
            throw new Error('Insufficient funds');
        }

        const senderNewBalance = senderOldBalance - data.amount;

        const receiverOldBalance = +receiverBalance

        const receiverNewBalance = receiverOldBalance + data.amount;


        const transaction = await this.prismaService.transactions.create({
            data: {
                senderId,
                receiverId,
                amount: new Decimal(data.amount),
                type: 'TRANSFER',
                Statements: {
                    create: [
                        {
                            accountId: senderId,
                            amount: new Decimal(-data.amount),
                            newBalance: new Decimal(senderNewBalance),
                            oldBalance: new Decimal(senderOldBalance),
                        },
                        {
                            accountId: receiverId,
                            amount: new Decimal(data.amount),
                            newBalance: new Decimal(receiverNewBalance),
                            oldBalance: new Decimal(receiverOldBalance),
                        },
                    ]
                }
            }
        })
        await this.prismaService.account.update({
            where: {
                id: senderId
            },
            data: {
                balance: new Decimal(senderNewBalance),
            }
        });

        await this.prismaService.account.update({
            where: {
                id: receiverId
            },
            data: {
                balance: new Decimal(receiverNewBalance),
            }
        });

        return transaction.id;
    }
} 