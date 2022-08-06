import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export function apply_middleware ( app: INestApplication ) {
    app.useGlobalPipes( new ValidationPipe( {
        whitelist: true,
    } ) );

    app.useGlobalInterceptors( new ClassSerializerInterceptor( new Reflector() ) );

    app.enableCors();
}
