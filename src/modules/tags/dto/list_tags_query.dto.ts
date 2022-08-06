import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListTagsQueryDto {
    @ApiProperty( { required: false } )
    @IsOptional()
    @IsString()
        sortByOrder: string;

    @ApiProperty( { required: false } )
    @IsOptional()
    @IsString()
        sortByName: string;

    @ApiProperty( { required: false } )
    @IsOptional()
    @Min( 0 )
    @IsInt()
    @Transform( ( val ) => Number.parseInt( val.value ) )
        offset: number;

    @ApiProperty( { required: false } )
    @IsOptional()
    @IsInt()
    @Transform( ( val ) => Number.parseInt( val.value ) )
        length: number;
}
