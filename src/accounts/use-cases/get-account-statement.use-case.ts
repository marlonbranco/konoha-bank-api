import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class GetAccountStatementUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    async execute (id: number,) {
        return await this.prismaService.statement.findMany({
            select: {
                amount: true,
                transaction: {
                    select: {
                        sender: true
                    }
                }
            },
            where: {
                accountId: id
            },

        });
    }
}