import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto implements Partial<Tag> {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
        name: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    @IsNotEmpty()
        sortOrder: number;
}
