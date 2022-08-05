import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { ConflictExceptionDto } from 'src/dto/conflict_exception.dto';
import { UserWithTags } from 'src/prisma/interfaces/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInterface } from './interfaces/create_user_interface';


@Injectable()
export class UsersService {
    constructor (
        private prisma_service: PrismaService,
    ) { }

    async get_by_email ( email: string ): Promise<User | null> {
        return await this.prisma_service.user.findUnique( {
            where: {
                email,
            },
        } )
            .catch( ( err ) => {
                console.log( err );
                throw err;
            } );
    }

    async get_by_id ( id: string, add_tags?: false ): Promise<User | null>;
    async get_by_id ( id: string, add_tags?: true ): Promise<UserWithTags | null>;
    async get_by_id ( id: string, add_tags: boolean = false ): Promise<User| UserWithTags | null> {
        return await this.prisma_service.user.findUnique( {
            where: {
                id,
            },
            include: {
                tags: add_tags,
            },
        } )
            .catch( ( err ) => {
                console.log( err );
                throw err;
            } );
    }

    async create_user ( user_signin_credentials_dto: CreateUserInterface ): Promise<User> {
        return await this.prisma_service.user.create( {
            data: user_signin_credentials_dto,
        } )
            .catch( ( err ) => {
                if ( err instanceof Prisma.PrismaClientKnownRequestError ) {
                    // The .code property can be accessed in a type-safe manner
                    if ( err.code === 'P2002' ) {
                        throw new ConflictExceptionDto( err.meta?.target as Array<string> );
                    }
                }
                throw err;
            } );
    }
}
