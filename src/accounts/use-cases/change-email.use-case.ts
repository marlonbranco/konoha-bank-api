import { Inject, Injectable } from "@nestjs/common";

import { AccountEntity } from "../entities/account.entity";
import { EmailAccountDto } from "../dto/email-account.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ChangeEmailAccountUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(AccountEntity)
    private accountEntity: AccountEntity;

    async execute (id: number, data: EmailAccountDto) {
        this.accountEntity.checkIfEmailExists(data.email);
        return await this.prismaService.account.update({
            where: {
                id
            },
            data: {
                email: data.email,
            }
        });
    }
} 