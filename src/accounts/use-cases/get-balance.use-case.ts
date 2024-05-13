import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";

@Injectable()
export class GetBalanceUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    async execute (id: number,) {
        return (await this.prismaService.account.findUnique({
            where: {
                id
            }
        })).balance
    }
}