import { DynamicModule, Module } from '@nestjs/common';
import { PrismaModule } from '../../modules/prisma/prisma.module';
import { TEST_HELPER_MODULE_OPTIONS_NAME } from './constants';
import { TestHelperModuleOptions } from './interfaces/test_helper_module_options';
import { TestHelperService } from './test_helper.service';

@Module( {
    providers: [TestHelperService],
    imports: [PrismaModule],
    exports: [TestHelperService],
} )
export class TestHelperModule {
    static register ( options: TestHelperModuleOptions ): DynamicModule {
        return {
            module: TestHelperModule,
            providers: [
                {
                    provide: TEST_HELPER_MODULE_OPTIONS_NAME,
                    useValue: options,
                },
                TestHelperService,
            ],
            imports: [PrismaModule],
            exports: [TestHelperService],
        };
    }
}
