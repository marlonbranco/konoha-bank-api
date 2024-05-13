import { Inject, Injectable } from "@nestjs/common";

import { AccountEntity } from "../entities/account.entity";
import { CreateAccountDto } from "../dto/create-account.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CreateAccountUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(AccountEntity)
    private accountEntity: AccountEntity;

    async execute (data: CreateAccountDto) {
        this.accountEntity.checkIfEmailExists(data.email);
        return await this.prismaService.account.create({
            data: {
                name: data.name,
                email: data.email,
                balance: 0,
                currency: 'USD'
            }
        });
    }
} 