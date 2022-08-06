import { IsArray, IsInt, IsNotEmpty } from 'class-validator';


export class ConnectTagsDto {
    @IsNotEmpty()
    @IsArray()
    @IsInt( { each: true } )
        tags: Array<number>;
}
