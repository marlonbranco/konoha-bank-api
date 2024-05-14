import { IsEmail, IsString } from 'class-validator';

export class CreateAccountDto {
    @IsString()
    readonly name: string;

    @IsEmail()
    readonly email: string;
}
