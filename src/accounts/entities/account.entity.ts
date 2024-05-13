import { Inject, Injectable } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AccountEntity {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    async checkIfEmailExists (email: string): Promise<boolean> {
        const account = await this.prismaService.account.findUnique({
            where: {
                email: email
            }
        });
        if (account) {
            throw new Error('An account with this email already exists');
        }
        return false;
    }

    async getAccountData (email: string) {
        return this.prismaService.account.findUnique({
            select: {
                id: true,
                email: true,
                balance: true,
            },
            where: {
                email: email
            }
        });
    }

    async checkIfAccountHasBalance (amount: Decimal, accountId: number): Promise<Decimal> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId
            }
        });

        if (account.balance < amount) {
            throw new Error("Insufficient funds");
        }

        return account.balance;
    }
}
