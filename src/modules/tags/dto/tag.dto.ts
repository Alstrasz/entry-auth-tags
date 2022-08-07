import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { TagWithCreator } from '../../prisma/interfaces/tag';
import { UserNameUidDto } from '../../users/dto/user.dto';

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
    @Exclude()
        id: number; // In docs this is omitted. Not sure why this should be omitted... but w/e

    @ApiProperty( { type: () => UserNameUidDto } )
    @Expose()
    @Type( () => UserNameUidDto )
        creator: UserNameUidDto;

    constructor ( data: TagWithCreator ) {
        super( data );
        this.creator = new UserNameUidDto( data.created_by );
    }
}
