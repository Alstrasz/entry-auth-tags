import { Test, TestingModule } from '@nestjs/testing';
import { TestHelperModule } from '../../helpers/test_helper/test_helper.module';
import { TestHelperService } from '../../helpers/test_helper/test_helper.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';

describe( 'AuthController', () => {
    let controller: AuthController;

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
    } );

    it( 'should be defined', () => {
        console.log( 2, test_helper_service.get_unique_user_signin_credentials_dto() );
        expect( controller ).toBeDefined();
    } );
} );
