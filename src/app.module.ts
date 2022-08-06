import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './helpers/logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TagsModule } from './modules/tags/tags.module';
import { PrismaModule } from './modules/prisma/prisma.module';


@Module( {
    imports: [UsersModule, AuthModule, TagsModule, PrismaModule],
    controllers: [AppController],
    providers: [AppService],
} )
export class AppModule implements NestModule {
    configure ( consumer: MiddlewareConsumer ) {
        consumer.apply( LoggerMiddleware ).forRoutes( '*' );
    }
}
