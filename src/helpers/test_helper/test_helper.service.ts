import { Inject, Injectable } from '@nestjs/common';
import { UserSigninCredentialsDto } from '../../modules/auth/dto/user_signin_credentials.dto';
import { TEST_HELPER_MODULE_OPTIONS_NAME } from './constants';
import { TestHelperModuleOptions } from './interfaces/test_helper_module_options';

@Injectable()
export class TestHelperService {
    private unique_name: string;
    private unique_id = {
        user_signin_credentials_dto: 0,
    };

    constructor ( @Inject( TEST_HELPER_MODULE_OPTIONS_NAME ) private options: TestHelperModuleOptions ) {
        this.unique_name = options?.test_bed_name || 'undefined';
    }

    get_unique_user_signin_credentials_dto (): UserSigninCredentialsDto {
        this.unique_id.user_signin_credentials_dto += 1;
        const unique_string = `${this.unique_name}${this.unique_id.user_signin_credentials_dto}`;
        return {
            email: `${unique_string}@a.com`,
            nickname: `${unique_string}`,
            password: `1aA${unique_string}`,
        };
    }
}
