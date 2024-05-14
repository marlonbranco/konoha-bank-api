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
                        type: true,
                        sender: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                        receiver: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                    }
                }
            },
            where: {
                accountId: id
            },
        });
    }
}