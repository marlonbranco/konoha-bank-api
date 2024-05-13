import { IsString } from 'class-validator';

export class EmailAccountDto {
    @IsString()
    readonly email: string;
}
