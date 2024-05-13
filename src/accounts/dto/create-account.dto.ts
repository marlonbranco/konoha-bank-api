import { IsString } from 'class-validator';

export class CreateAccountDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly email: string;
}
