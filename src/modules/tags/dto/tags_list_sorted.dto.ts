import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import * as _ from 'lodash';
import { PaginationMetadataDto } from 'src/dto/pagination_metadata.dto';
import { TagWithCreator } from 'src/modules/prisma/interfaces/tag';
import { TagWithCreatorDto } from './tag.dto';

@Exclude()
export class TagsListSortedDto {
    @Expose()
    @ApiProperty( { type: TagWithCreatorDto } )
    @Type( () => TagWithCreatorDto )
        data: Array<TagWithCreatorDto>;

    @Expose()
    @ApiProperty( { type: PaginationMetadataDto } )
    @Type( () => PaginationMetadataDto )
        meta: PaginationMetadataDto;

    constructor ( data: Array<TagWithCreator>, quantity: number, offset: number = 0, length: number = quantity - offset ) {
        this.data = _.map( data, ( elem ) => {
            return new TagWithCreatorDto( elem );
        } );

        this.meta = new PaginationMetadataDto( quantity, offset, length );
    }
}
