import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { jwt_constants } from '../constants';

@Exclude()
export class AccessTokenDto {
    @ApiProperty()
    @Expose()
        token: string;
    @ApiProperty()
    @Expose()
        expire: string;

    constructor ( token: string ) {
        this.token = token;
        this.expire = jwt_constants.EXPIRE_TIME;
    }
}
