import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module( {
    providers: [TagsService],
    controllers: [TagsController],
    imports: [
        UsersModule,
        PrismaModule,
    ],
    exports: [
        TagsService,
    ],
} )
export class TagsModule {}
