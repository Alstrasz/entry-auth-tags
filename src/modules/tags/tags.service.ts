import { Injectable } from '@nestjs/common';
import { Prisma, Tag, User } from '@prisma/client';
import { TagWithCreator } from '../prisma/interfaces/tag';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create_tag.dto';
import { UpdateTagDto } from './dto/update_tag.dto';

@Injectable()
export class TagsService {
    constructor (
        private prisma_service: PrismaService,
    ) { }

    async create_tag ( create_tag_dto: CreateTagDto, creator: User ): Promise<Tag> {
        return this.prisma_service.tag.create( {
            data: {
                name: create_tag_dto.name,
                sortOrder: create_tag_dto.sortOrder,
                created_by: {
                    connect: {
                        id: creator.id,
                    },
                },
            },
        } );
    }

    async get_tag_by_id ( id: number ): Promise<TagWithCreator> {
        return this.prisma_service.tag.findUnique( {
            where: {
                id,
            },
            include: {
                created_by: true,
            },
        } );
    }

    async get_all_sorted ( sort_by_order: boolean = false, sort_by_name: boolean = false, offset: number = 0, length: number = -1 ): Promise<Array<TagWithCreator>> {
        const order_by: Array<Prisma.TagOrderByWithAggregationInput> = [];
        if ( sort_by_order ) {
            order_by.push( { sortOrder: 'asc' } );
        }
        if ( sort_by_name ) {
            order_by.push( { name: 'asc' } );
        }
        return this.prisma_service.tag.findMany( {
            orderBy: order_by,
            skip: offset,
            take: length != -1 ? length : undefined,
            include: {
                created_by: true,
            },
        } );
    }

    async update_tag ( id: number, update_tag_dto: UpdateTagDto ): Promise<TagWithCreator> {
        return this.prisma_service.tag.update( {
            where: {
                id,
            },
            data: update_tag_dto,
            include: {
                created_by: true,
            },
        } );
    }

    async delete_tag ( id: number ) {
        return this.prisma_service.tag.delete( {
            where: {
                id,
            },
        } );
    }

    async count_all (): Promise<number> {
        return this.prisma_service.tag.count();
    }
}
