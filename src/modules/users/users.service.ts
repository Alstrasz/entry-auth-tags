import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as _ from 'lodash';
import { AuthService } from '../auth/auth.service';
import { UserWithCreatedTags, UserWithTags } from '../prisma/interfaces/user';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { CreateUserInterface } from './interfaces/create_user_interface';


@Injectable()
export class UsersService {
    constructor (
        @Inject( forwardRef( ()=> AuthService ) )
        private auth_service: AuthService,
        private prisma_service: PrismaService,
    ) { }

    async get_by_email ( email: string ): Promise<User | null> {
        return this.prisma_service.user.findUnique( {
            where: {
                email,
            },
        } );
    }

    async get_by_id ( id: string, add_tags?: 'none' ): Promise<User | null>;
    async get_by_id ( id: string, add_tags?: 'tags' ): Promise<UserWithTags | null>;
    async get_by_id ( id: string, add_tags?: 'created' ): Promise<UserWithCreatedTags | null>;
    async get_by_id ( id: string, add_tags: string = 'none' ): Promise<User| UserWithTags | null> {
        return this.prisma_service.user.findUnique( {
            where: {
                id,
            },
            include: {
                tags: add_tags == 'tags',
                created_tags: add_tags == 'created',
            },
        } );
    }

    async create_user ( user_signin_credentials_dto: CreateUserInterface ): Promise<User> {
        return this.prisma_service.user.create( {
            data: user_signin_credentials_dto,
        } )
            .catch( ( err ) => {
                if ( err instanceof Prisma.PrismaClientKnownRequestError ) {
                    this.prisma_service.default_exception_handler( err, { conflict: true } );
                }
                throw err;
            } );
    }

    async update_user ( id: string, update_user_dto: UpdateUserDto ): Promise<User> {
        const update_query: Prisma.UserUpdateInput = {};
        if ( update_user_dto.email ) {
            update_query.email = update_user_dto.email;
        }
        if ( update_user_dto.nickname ) {
            update_query.nickname = update_user_dto.nickname;
        }
        if ( update_user_dto.password ) {
            const { hash, salt } = this.auth_service.create_hash_salt( update_user_dto.password );
            update_query.password = hash;
            update_query.salt = salt;
        }
        return this.prisma_service.user.update( {
            where: {
                id,
            },
            data: update_query,
        } )
            .catch( ( err ) => {
                if ( err instanceof Prisma.PrismaClientKnownRequestError ) {
                    this.prisma_service.default_exception_handler( err, { conflict: true } );
                }
                throw err;
            } );
    }

    async delete_user ( id: string ) {
        await this.prisma_service.user.delete( {
            where: {
                id,
            },
        } );
    }

    async connect_tags ( id: string, tag_ids: Array<number> ): Promise<UserWithTags> {
        return this.prisma_service.$transaction( async ( prisma ) => {
            const tags = await prisma.tag.findMany( { where: { id: { in: tag_ids } } } );

            return prisma.user.update( {
                where: {
                    id,
                },
                data: {
                    tags: {
                        connect: _.map( tags, ( elem ) => {
                            return { id: elem.id };
                        } ),
                    },
                },
                include: {
                    tags: true,
                },
            } );
        } );
    }

    async unassign_tag ( id: string, tag_id: number ): Promise<UserWithTags> {
        return this.prisma_service.user.update( {
            where: {
                id,
            },
            data: {
                tags: {
                    disconnect: {
                        id: tag_id,
                    },
                },
            },
            include: {
                tags: true,
            },
        } );
    }
}
