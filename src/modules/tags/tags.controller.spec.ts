import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { TestHelperModule } from '../../helpers/test_helper/test_helper.module';
import { TestHelperService } from '../../helpers/test_helper/test_helper.service';
import { TagsController } from './tags.controller';
import { TagsModule } from './tags.module';
import { UserSigninCredentialsDto } from '../auth/dto/user_signin_credentials.dto';
import { TagsListSortedDto } from './dto/tags_list_sorted.dto';

describe( 'TagsController', () => {
    let controller: TagsController;
    let app: INestApplication;
    let user: {
        user_signin_credentials_dto: UserSigninCredentialsDto;
        token: string;
    };

    let test_helper_service: TestHelperService;
    beforeAll( async () => {
        const test_helper_module: TestingModule = await Test.createTestingModule( {
            imports: [TestHelperModule.register( { test_bed_name: 'TagsController' } )],
        } ).compile();

        test_helper_service = test_helper_module.get<TestHelperService>( TestHelperService );
    } );

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule( {
            imports: [TagsModule],
        } ).compile();

        user = await test_helper_service.sign_in_unique_user();
        controller = module.get<TagsController>( TagsController );
        app = await test_helper_service.create_application( module );
    } );

    it( 'should be defined', () => {
        expect( controller ).toBeDefined();
    } );

    it( 'should create tag properly', () => {
        const dto = test_helper_service.get_unique_create_tag_dto();

        return request( app.getHttpServer() )
            .post( '/tag' )
            .auth( user.token, { type: 'bearer' } )
            .send( dto )
            .expect( 201 )
            .expect( ( res ) => {
                expect( res.body.name ).toBe( dto.name );
            } );
    } );

    it( 'should get tag properly', async () => {
        const tag_info = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );

        return request( app.getHttpServer() )
            .get( `/tag/${tag_info.tag.id}` )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 )
            .expect( ( res ) => {
                expect( res.body.name ).toBe( tag_info.tag.name );
                expect( res.body.creator.email ).toBe( user.user_signin_credentials_dto.email );
            } );
    } );

    it( 'should create and get tag properly', async () => {
        const dto = test_helper_service.get_unique_create_tag_dto();
        let id: number;

        await request( app.getHttpServer() )
            .post( '/tag' )
            .auth( user.token, { type: 'bearer' } )
            .send( dto )
            .expect( 201 )
            .expect( ( res ) => {
                id = res.body.id;
            } );


        return request( app.getHttpServer() )
            .get( `/tag/${id}` )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 )
            .expect( ( res ) => {
                expect( res.body.name ).toBe( dto.name );
                expect( res.body.creator.email ).toBe( user.user_signin_credentials_dto.email );
            } );
    } );

    it( 'should update tag properly', async () => {
        const tag_info = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );
        const dto = test_helper_service.get_unique_create_tag_dto();

        await request( app.getHttpServer() )
            .put( `/tag/${tag_info.tag.id}` )
            .auth( user.token, { type: 'bearer' } )
            .send( {
                name: dto.name,
            } )
            .expect( 200 )
            .expect( ( res ) => {
                expect( res.body.name ).toBe( dto.name );
            } );

        return request( app.getHttpServer() )
            .put( `/tag/${tag_info.tag.id}` )
            .auth( user.token, { type: 'bearer' } )
            .send( {
                sortOrder: dto.sortOrder,
            } )
            .expect( 200 )
            .expect( ( res ) => {
                expect( res.body.sortOrder ).toBe( dto.sortOrder );
            } );
    } );

    it( 'should update and get tag properly', async () => {
        const tag_info = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );
        const dto = test_helper_service.get_unique_create_tag_dto();

        await request( app.getHttpServer() )
            .put( `/tag/${tag_info.tag.id}` )
            .auth( user.token, { type: 'bearer' } )
            .send( dto )
            .expect( 200 )
            .expect( ( res ) => {
                expect( res.body.name ).toBe( dto.name );
            } );

        return request( app.getHttpServer() )
            .get( `/tag/${tag_info.tag.id}` )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 )
            .expect( ( res ) => {
                expect( res.body.name ).toBe( dto.name );
                expect( res.body.sortOrder ).toBe( dto.sortOrder );
            } );
    } );

    it( 'should allow only creator to update', async () => {
        const tag_info = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );
        const dto = test_helper_service.get_unique_create_tag_dto();
        const user_2 = await test_helper_service.sign_in_unique_user();

        return request( app.getHttpServer() )
            .put( `/tag/${tag_info.tag.id}` )
            .auth( user_2.token, { type: 'bearer' } )
            .send( dto )
            .expect( 403 );
    } );

    it( 'should delete tag properly', async () => {
        const tag_info = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );

        await request( app.getHttpServer() )
            .delete( `/tag/${tag_info.tag.id}` )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 );

        return request( app.getHttpServer() )
            .get( `/tag/${tag_info.tag.id}` )
            .auth( user.token, { type: 'bearer' } )
            .expect( 404 );
    } );

    it( 'should create and delete tag properly', async () => {
        const dto = test_helper_service.get_unique_create_tag_dto();
        let id: number;

        await request( app.getHttpServer() )
            .post( '/tag' )
            .auth( user.token, { type: 'bearer' } )
            .send( dto )
            .expect( 201 )
            .expect( ( res ) => {
                id = res.body.id;
            } );


        await request( app.getHttpServer() )
            .delete( `/tag/${id}` )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 );

        return request( app.getHttpServer() )
            .get( `/tag/${id}` )
            .auth( user.token, { type: 'bearer' } )
            .expect( 404 );
    } );

    it( 'should allow only creator to delete', async () => {
        const tag_info = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );
        const user_2 = await test_helper_service.sign_in_unique_user();

        return request( app.getHttpServer() )
            .delete( `/tag/${tag_info.tag.id}` )
            .auth( user_2.token, { type: 'bearer' } )
            .expect( 403 );
    } );

    it( 'should get all sorted properly', async () => {
        const _tag_info_1 = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );
        const _tag_info_2 = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );
        const _tag_info_3 = await test_helper_service.create_unique_tag( user.user_signin_credentials_dto.email );

        await request( app.getHttpServer() )
            .get( `/tag` )
            .auth( user.token, { type: 'bearer' } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: TagsListSortedDto = res.body;
                expect( body.data.length ).toEqual( body.meta.length );
            } );

        await request( app.getHttpServer() )
            .get( `/tag` )
            .auth( user.token, { type: 'bearer' } )
            .query( {
                sortByOrder: '',
            } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: TagsListSortedDto = res.body;
                for ( let i = 0; i < body.data.length - 1; i++ ) {
                    expect( body.data[i].sortOrder ).toBeLessThanOrEqual( body.data[i + 1].sortOrder );
                }
            } );

        await request( app.getHttpServer() )
            .get( `/tag` )
            .auth( user.token, { type: 'bearer' } )
            .query( {
                sortByName: '',
            } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: TagsListSortedDto = res.body;
                for ( let i = 0; i < body.data.length - 1; i++ ) {
                    expect( body.data[i].name < body.data[i + 1].name ).toBeTruthy();
                }
            } );

        const offset = 2;
        await request( app.getHttpServer() )
            .get( `/tag` )
            .auth( user.token, { type: 'bearer' } )
            .query( {
                offset,
            } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: TagsListSortedDto = res.body;
                expect( body.meta.offset ).toEqual( offset );
                expect( body.meta.quantity - offset ).toEqual( body.meta.length );
            } );

        const length= 2;
        await request( app.getHttpServer() )
            .get( `/tag` )
            .auth( user.token, { type: 'bearer' } )
            .query( {
                length,
            } )
            .expect( 200 )
            .expect( ( res ) => {
                const body: TagsListSortedDto = res.body;
                expect( body.meta.length ).toEqual( length );
            } );
    } );
} );
