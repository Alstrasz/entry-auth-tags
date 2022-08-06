import { Test, TestingModule } from '@nestjs/testing';
import { TestHelperModule } from '../../helpers/test_helper/test_helper.module';
import { TestHelperService } from '../../helpers/test_helper/test_helper.service';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';

describe( 'UsersController', () => {
    let controller: UsersController;

    let test_helper_service: TestHelperService;
    beforeAll( async () => {
        const test_helper_module: TestingModule = await Test.createTestingModule( {
            imports: [TestHelperModule.register( { test_bed_name: 'AuthController' } )],
        } ).compile();

        test_helper_service = test_helper_module.get<TestHelperService>( TestHelperService );
    } );

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule( {
            imports: [UsersModule],
        } ).compile();

        controller = module.get<UsersController>( UsersController );
    } );

    it( 'should be defined', () => {
        console.log( 1, test_helper_service.get_unique_user_signin_credentials_dto() );
        expect( controller ).toBeDefined();
    } );
} );
