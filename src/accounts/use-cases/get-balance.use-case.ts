import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";

@Injectable()
export class GetBalanceUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    async execute (id: number,) {
        const { email, currency, balance } = await this.prismaService.account.findUnique({
            select: {
                email: true,
                currency: true,
                balance: true
            },
            where: {
                id
            }
        });

        if (!email) {
            throw new Error('Account not found');
        }

        return { currency, balance: +balance.toFixed(2) }
    }
}