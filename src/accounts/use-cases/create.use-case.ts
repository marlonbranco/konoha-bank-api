import { Inject, Injectable } from "@nestjs/common";

import { AccountEntity } from "../entities/account.entity";
import { CreateAccountDto } from "../dto/create-account.dto";
import { PrismaService } from "src/prisma.service";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class CreateAccountUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(AccountEntity)
    private accountEntity: AccountEntity;

    async execute (data: CreateAccountDto) {
        await this.accountEntity.checkIfEmailExists(data.email);
        return await this.prismaService.account.create({
            data: {
                name: data.name,
                email: data.email,
                balance: new Decimal(0.00),
                currency: 'USD'
            }
        });
    }
} 