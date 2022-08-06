import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto implements Partial<Tag> {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        name: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
        sortOrder: number;
}
