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

describe( 'AuthController', () => {
    let app: INestApplication;
    let controller: AuthController;
    let service: AuthService;

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
        app = await test_helper_service.create_application( module );
    } );

    it( 'should be defined', () => {
        expect( controller ).toBeDefined();
    } );

    it( 'should signin properly', async () => {
        const credentials = test_helper_service.get_unique_user_signin_credentials_dto();

        return request( app.getHttpServer() )
            .post( '/auth/signin' )
            .send( credentials )
            .expect( 201 )
            .expect( ( res ) => {
                expect( service.verify_token( ( res.body as AccessTokenDto ).token ) ).toBeTruthy();
            } );
    } );

    it( 'should login properly', async () => {
        const credentials = ( await test_helper_service.sign_in_unique_user() ).user_signin_credentials_dto;

        const login_credentials: UserLoginCredentialsDto = {
            email: credentials.email,
            password: credentials.password,
        };

        return request( app.getHttpServer() )
            .post( '/auth/login' )
            .send( login_credentials )
            .expect( 200 )
            .expect( ( res ) => {
                expect( service.verify_token( ( res.body as AccessTokenDto ).token ) ).toBeTruthy();
            } );
    } );
} );
