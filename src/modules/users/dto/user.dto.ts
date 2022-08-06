import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import * as _ from 'lodash';
import { UserWithTags } from '../../prisma/interfaces/user';
import { TagDto } from '../../tags/dto/tag.dto';

@Exclude()
export class UserDto implements Omit<User, 'password' | 'salt' | 'id'> {
    @ApiProperty()
    @Expose()
        email: string;

    @ApiProperty()
    @Expose()
        nickname: string;

    constructor ( data: User ) {
        Object.assign( this, data );
    }
}

@Exclude()
export class UserWithTagsDto extends UserDto {
    @ApiProperty( { type: TagDto } )
    @Expose()
    @Type( () => TagDto )
        tags: Array<TagDto>;

    constructor ( data: UserWithTags ) {
        super( data );
        this.tags = _.map( data.tags, ( elem ) => {
            return new TagDto( elem );
        } );
    }
}
