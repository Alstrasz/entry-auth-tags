import { Test, TestingModule } from '@nestjs/testing';
import { TestHelperModule } from '../../helpers/test_helper/test_helper.module';
import { TestHelperService } from '../../helpers/test_helper/test_helper.service';
import { TagsController } from './tags.controller';
import { TagsModule } from './tags.module';

describe( 'TagsController', () => {
    let controller: TagsController;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let test_helper_service: TestHelperService;
    beforeAll( async () => {
        const test_helper_module: TestingModule = await Test.createTestingModule( {
            imports: [TestHelperModule.register( { test_bed_name: 'AuthController' } )],
        } ).compile();

        test_helper_service = test_helper_module.get<TestHelperService>( TestHelperService );
    } );

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule( {
            imports: [TagsModule],
        } ).compile();

        controller = module.get<TagsController>( TagsController );
    } );

    it( 'should be defined', () => {
        expect( controller ).toBeDefined();
    } );
} );
