import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { password_regex } from 'src/modules/auth/constants';


export class UpdateUserDto implements Partial<User> {
    @ApiProperty( { required: false } )
    @IsOptional()
    @IsEmail()
        email?: string;

    @ApiProperty( { required: false } )
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches( password_regex )
    @MaxLength( 32 )
    @MinLength( 8 )
        password?: string;

    @ApiProperty( { required: false } )
    @IsOptional()
    @IsNotEmpty()
    @IsString()
        nickname?: string;
}
