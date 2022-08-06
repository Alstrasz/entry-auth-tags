import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import * as _ from 'lodash';
import { TagDto } from './tag.dto';

@Exclude()
export class TagsListDto {
    @Expose()
    @ApiProperty( { type: TagDto } )
    @Type( () => TagDto )
        tags: Array<TagDto>;

    constructor ( tags: Array<Tag> ) {
        this.tags = _.map( tags, ( elem ) => {
            return new TagDto( elem );
        } );
    }
}
