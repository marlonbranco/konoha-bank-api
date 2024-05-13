import { Inject, Injectable } from "@nestjs/common";

import { UpdateAccountDto } from "../dto/update-account.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UpdateAccountUseCase {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    async execute (id: number, data: UpdateAccountDto) {
        return await this.prismaService.account.update({
            where: {
                id
            },
            data: {
                name: data.name,
            }
        });
    }
} 