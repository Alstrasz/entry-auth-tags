import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apply_middleware } from './helpers/apply_middleware';


export function setup_swagger ( app: INestApplication ) {
    const config = new DocumentBuilder()
        .setTitle( 'entry-auth-tags' )
        .setDescription( 'Api descciption of entry-auth-tags, project build to pass entry task. It provides simple local and jwt auth and CRUD for tags' )
        .setVersion( '1.0.0' )
        .addTag( 'App' )
        .addBearerAuth( {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token issued when logged in \ registered',
        } )
        .build();
    const document = SwaggerModule.createDocument( app, config );
    SwaggerModule.setup( 'api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    } );
}


async function bootstrap () {
    const app = await NestFactory.create( AppModule,
        {
            logger: ['log', 'error', 'warn', 'debug', 'verbose'],
        } );

    apply_middleware( app );

    setup_swagger( app );

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '127.0.0.1';
    await app.listen( port, host, () => {
        console.log( 'App listening at ', port, host );
    } );
}

bootstrap();
