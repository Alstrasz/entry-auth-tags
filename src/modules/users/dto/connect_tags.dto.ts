import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';


export class ConnectTagsDto {
    @ApiProperty( { type: [Number] } )
    @IsNotEmpty()
    @IsArray()
    @IsInt( { each: true } )
        tags: Array<number>;
}
