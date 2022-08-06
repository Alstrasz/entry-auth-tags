import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConflictExceptionDto } from '../../dto/conflict_exception.dto';
import { PRISMA_ERROR_CODES } from './constants';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger( PrismaService.name );

    async onModuleInit () {
        await this.$connect();

        // logging middleware
        this.$use( async ( params, next ) => {
            const before = Date.now();

            const result = await next( params );

            const after = Date.now();

            this.logger.log( `Query ${params.model}.${params.action} took ${after - before}ms` );

            return result;
        } );
    }

    async enableShutdownHooks ( app: INestApplication ) {
        this.$on( 'beforeExit', async () => {
            await app.close();
        } );
    }

    /**
     * Converts known error codes to their Http counterpart
     *
     * @param {Prisma.PrismaClientKnownRequestError} err
     * @param {{
     *             conflict: boolean,
     *         }} options
     * @memberof PrismaService
     */
    default_exception_handler (
        err: Prisma.PrismaClientKnownRequestError,
        options: {
            conflict?: boolean,
        },
    ) {
        if ( options.conflict ) {
            if ( err.code === PRISMA_ERROR_CODES.conflict ) {
                throw new ConflictExceptionDto( err.meta?.target as Array<string> );
            }
        }
    }
}
