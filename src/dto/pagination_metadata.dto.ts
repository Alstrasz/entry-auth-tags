import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaginationMetadataDto {
    @Expose()
    @ApiProperty()
        offset: number;

    @Expose()
    @ApiProperty()
        length: number;

    @Expose()
    @ApiProperty()
        quantity: number;

    constructor ( quantity: number, offset: number = 0, length: number = quantity - offset ) {
        this.offset = offset;
        let qe = quantity - offset;
        qe = qe > 0 ? qe : 0;
        this.length = length < qe ? length : qe;
        this.quantity = quantity;
    }
}
