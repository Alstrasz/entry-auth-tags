import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TestHelperModule } from '../../helpers/test_helper/test_helper.module';
import { TestHelperService } from '../../helpers/test_helper/test_helper.service';
import { UserSigninCredentialsDto } from '../auth/dto/user_signin_credentials.dto';
import { UserWithTagsDto } from './dto/user.dto';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe( 'UsersController', () => {
    let controller: UsersController;
    let service: UsersService;
    let app: INestApplication;
    let user: {
        user_signin_credentials_dto: UserSigninCredentialsDto;
        token: string;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let test_helper_service: TestHelperService;
    beforeAll( async () => {
        const test_helper_module: TestingModule = await Test.createTestingModule( {
            imports: [TestHelperModule.register( { test_bed_name: 'UsersController' } )],
        } ).compile();

        test_helper_service = test_helper_module.get<TestHelperService>( TestHelperService );
    } );

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule( {
            imports: [UsersModule],
        } ).compile();

        controller = module.get<UsersController>( UsersController );
        service = module.get<UsersService>( UsersService );
        user = await test_helper_service.sign_in_unique_user();
        app = await test_helper_service.create_application( module );
    } );

    it( 'should be defined', () => {
        expect( controller ).toBeDefined();
    } );

    it( 'should jwt guard properly', async () => {
        await request( app.getHttpServer() )
            .get( '/user' )
            .expect( 401 );

        return request( app.getHttpServer() )
            .get( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 );
    } );

    it( 'should get user properly', async () => {
        return request( app.getHttpServer() )
            .get( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: UserWithTagsDto = res.body;
                expect( body.email ).toEqual( user.user_signin_credentials_dto.email );
                expect( body.nickname ).toEqual( user.user_signin_credentials_dto.nickname );
            } );
    } );

    it( 'should update user properly', async () => {
        const dto = test_helper_service.get_unique_user_signin_credentials_dto();

        await request( app.getHttpServer() )
            .put( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .send( {
                email: dto.email,
            } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: UserWithTagsDto = res.body;
                expect( body.email ).toEqual( dto.email );
                expect( body.nickname ).toEqual( user.user_signin_credentials_dto.nickname );
            } );

        await request( app.getHttpServer() )
            .put( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .send( {
                nickname: dto.nickname,
            } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: UserWithTagsDto = res.body;
                expect( body.email ).toEqual( dto.email );
                expect( body.nickname ).toEqual( dto.nickname );
            } );

        return request( app.getHttpServer() )
            .put( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .send( {
                password: dto.password,
            } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: UserWithTagsDto = res.body;
                expect( body.email ).toEqual( dto.email );
                expect( body.nickname ).toEqual( dto.nickname );
            } );
    } );

    it( 'should enforce unique on update', async () => {
        const data = await test_helper_service.sign_in_unique_user();

        await request( app.getHttpServer() )
            .put( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .send( {
                email: data.user_signin_credentials_dto.email,
            } )
            .expect( 409 );

        return request( app.getHttpServer() )
            .put( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .send( {
                nickname: data.user_signin_credentials_dto.nickname,
            } )
            .expect( 409 );
    } );

    it( 'should delete properly', async () => {
        await request( app.getHttpServer() )
            .delete( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 );

        expect( await service.get_by_email( user.user_signin_credentials_dto.email ) ).toBeNull();

        return request( app.getHttpServer() )
            .get( '/user' )
            .auth( user.token, { type: 'bearer' } )
            .expect( 401 );
    } );
} );
