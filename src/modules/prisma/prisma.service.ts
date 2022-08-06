import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
}
