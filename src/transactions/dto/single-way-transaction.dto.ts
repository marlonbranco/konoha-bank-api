import { IsString, IsNumber } from "class-validator";

export class SingleWayTransactionDto {
    @IsString()
    readonly email: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    readonly amount: number;
}
