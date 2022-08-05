import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { password_regex } from '../constants';

export class UserSigninCredentialsDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
        email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        nickname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches( password_regex )
    @MaxLength( 32 )
    @MinLength( 8 )
        password: string;
}
