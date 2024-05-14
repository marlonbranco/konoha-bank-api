import { IsEmail } from 'class-validator';

export class EmailAccountDto {
    @IsEmail()
    readonly email: string;
}
