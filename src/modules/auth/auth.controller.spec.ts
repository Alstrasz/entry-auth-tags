import { Test, TestingModule } from '@nestjs/testing';
import { TestHelperModule } from '../../helpers/test_helper/test_helper.module';
import { TestHelperService } from '../../helpers/test_helper/test_helper.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AccessTokenDto } from './dto/access_token.dto';
import { AuthService } from './auth.service';
import { UserLoginCredentialsDto } from './dto/user_login_credentials.dto';
import { UserSigninCredentialsDto } from './dto/user_signin_credentials.dto';

describe( 'AuthController', () => {
    let app: INestApplication;
    let controller: AuthController;
    let service: AuthService;
    let user: {
        user_signin_credentials_dto: UserSigninCredentialsDto;
        token: string;
    };

    let test_helper_service: TestHelperService;
    beforeAll( async () => {
        const test_helper_module: TestingModule = await Test.createTestingModule( {
            imports: [TestHelperModule.register( { test_bed_name: 'AuthController' } )],
        } ).compile();

        test_helper_service = test_helper_module.get<TestHelperService>( TestHelperService );
    } );

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule( {
            imports: [AuthModule],
        } ).compile();

        controller = module.get<AuthController>( AuthController );
        service = module.get<AuthService>( AuthService );
        user = await test_helper_service.sign_in_unique_user();
        app = await test_helper_service.create_application( module );
    } );

    it( 'should be defined', () => {
        expect( controller ).toBeDefined();
    } );

    it( 'should signin properly', async () => {
        const credentials = test_helper_service.get_unique_user_signin_credentials_dto();

        return request( app.getHttpServer() )
            .post( '/signin' )
            .send( credentials )
            .expect( 201 )
            .expect( ( res ) => {
                const body: AccessTokenDto = res.body;
                expect( service.verify_token( body.token ) ).toBeTruthy();
            } );
    } );

    it( 'should enforce password limitations', async () => {
        const credentials = test_helper_service.get_unique_user_signin_credentials_dto();

        credentials.password = '12345678';
        await request( app.getHttpServer() )
            .post( '/signin' )
            .send( credentials )
            .expect( 400 );

        credentials.password = 'qwertyui';
        await request( app.getHttpServer() )
            .post( '/signin' )
            .send( credentials )
            .expect( 400 );

        credentials.password = 'QWERTYUI';
        await request( app.getHttpServer() )
            .post( '/signin' )
            .send( credentials )
            .expect( 400 );

        credentials.password = 'A2345678';
        await request( app.getHttpServer() )
            .post( '/signin' )
            .send( credentials )
            .expect( 400 );

        credentials.password = 'aA1';
        await request( app.getHttpServer() )
            .post( '/signin' )
            .send( credentials )
            .expect( 400 );

        credentials.password = 'aA1234567890123456789012345678901234567890';
        await request( app.getHttpServer() )
            .post( '/signin' )
            .send( credentials )
            .expect( 400 );

        credentials.password = 'aA12345678';
        return request( app.getHttpServer() )
            .post( '/signin' )
            .send( credentials )
            .expect( 201 );
    } );

    it( 'should login properly', async () => {
        const login_credentials: UserLoginCredentialsDto = {
            email: user.user_signin_credentials_dto.email,
            password: user.user_signin_credentials_dto.password,
        };

        return request( app.getHttpServer() )
            .post( '/login' )
            .send( login_credentials )
            .expect( 200 )
            .expect( ( res ) => {
                expect( service.verify_token( ( res.body as AccessTokenDto ).token ) ).toBeTruthy();
            } );
    } );

    it( 'should not login with wrong credentials', async () => {
        let login_credentials: UserLoginCredentialsDto = {
            email: user.user_signin_credentials_dto.email + '1',
            password: user.user_signin_credentials_dto.password,
        };

        await request( app.getHttpServer() )
            .post( '/login' )
            .send( login_credentials )
            .expect( 401 );

        login_credentials = {
            email: user.user_signin_credentials_dto.email,
            password: user.user_signin_credentials_dto.password + '1',
        };

        return request( app.getHttpServer() )
            .post( '/login' )
            .send( login_credentials )
            .expect( 401 );
    } );

    it( 'should enforce unique constraint on sigin properly', async () => {
        const credentials = test_helper_service.get_unique_user_signin_credentials_dto();

        await request( app.getHttpServer() )
            .post( '/signin' )
            .send( {
                email: user.user_signin_credentials_dto.email,
                nickname: credentials.nickname,
                password: credentials.password,
            } )
            .expect( 409 );

        await request( app.getHttpServer() )
            .post( '/signin' )
            .send( {
                email: credentials.email,
                nickname: user.user_signin_credentials_dto.nickname,
                password: credentials.password,
            } )
            .expect( 409 );

        return request( app.getHttpServer() )
            .post( '/signin' )
            .send( {
                email: credentials.email,
                nickname: credentials.nickname,
                password: user.user_signin_credentials_dto.password,
            } )
            .expect( 201 )
            .expect( ( res ) => {
                const body: AccessTokenDto = res.body;
                expect( service.verify_token( body.token ) ).toBeTruthy();
            } );
    } );

    it( 'should enforse jwt bearer auth', async () => {
        await request( app.getHttpServer() )
            .post( '/logout' )
            .expect( 401 );

        await request( app.getHttpServer() )
            .post( '/logout' )
            .auth( user.token + '1', { type: 'bearer' } )
            .expect( 401 );

        return request( app.getHttpServer() )
            .post( '/logout' )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 );
    } );

    it( 'should logout properly', async () => {
        return request( app.getHttpServer() ) // there is no robust way to invalidate simple jwt bearer auth, access refresh tokens requiered for that.
            .post( '/logout' ) // Considering limitations... Just pretending not to track this user anymore -)
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 );
    } );
} );
