import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { TagWithCreator } from '../../prisma/interfaces/tag';
import { UserDto } from '../../users/dto/user.dto';

@Exclude()
export class TagDto implements Omit<Tag, 'creator'> {
    @ApiProperty()
    @Expose()
        id: number;

    @ApiProperty()
    @Expose()
        name: string;

    @ApiProperty()
    @Expose()
        sortOrder: number;

    constructor ( data: Tag ) {
        Object.assign( this, data );
    }
}

@Exclude()
export class TagWithCreatorDto extends TagDto {
    @ApiProperty( { type: UserDto } )
    @Expose()
    @Type( () => UserDto )
        creator: UserDto;

    constructor ( data: TagWithCreator ) {
        super( data );
        this.creator = new UserDto( data.created_by );
    }
}
