import { IsEmail, IsNumber } from 'class-validator';


export class BothWaysTransactionDto {
    @IsEmail()
    readonly emailSender: string;

    @IsEmail()
    readonly emailReceiver?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    readonly amount: number;
}
