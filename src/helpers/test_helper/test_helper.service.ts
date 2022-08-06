import { INestApplication, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from '../../modules/tags/dto/create_tag.dto';
import { AuthService } from '../../modules/auth/auth.service';
import { UserSigninCredentialsDto } from '../../modules/auth/dto/user_signin_credentials.dto';
import { TEST_HELPER_MODULE_OPTIONS_NAME } from './constants';
import { TestHelperModuleOptions } from './interfaces/test_helper_module_options';
import { UsersService } from '../../modules/users/users.service';
import { TagsService } from '../../modules/tags/tags.service';
import { TestingModule } from '@nestjs/testing';
import { apply_middleware } from '../apply_middleware';

@Injectable()
export class TestHelperService {
    private unique_name: string;
    private unique_id = {
        user: 0,
        tag: 0,
    };

    constructor (
        @Inject( TEST_HELPER_MODULE_OPTIONS_NAME ) private options: TestHelperModuleOptions,
        private auth_service: AuthService,
        private users_service: UsersService,
        private tags_service: TagsService,
    ) {
        this.unique_name = options?.test_bed_name || 'undefined';
    }

    get_unique_user_signin_credentials_dto (): UserSigninCredentialsDto {
        this.unique_id.user += 1;
        const unique_string = `${this.unique_name}${this.unique_id.user}`;
        return {
            email: `${unique_string}@a.com`,
            nickname: `${unique_string}`,
            password: `1aA${unique_string}`,
        };
    }

    async sign_in_unique_user () {
        const user_signin_credentials_dto = this.get_unique_user_signin_credentials_dto();
        const token = await this.auth_service.signin( user_signin_credentials_dto );
        return { user_signin_credentials_dto, token };
    }

    get_unique_create_tag_dto (): CreateTagDto {
        this.unique_id.tag += 1;
        const unique_string = `${this.unique_name}${this.unique_id.tag}`;
        return {
            name: unique_string,
            sortOrder: this.unique_id.tag,
        };
    }

    async create_unique_tag ( creator_email?: string ) {
        let token = undefined;
        if ( !creator_email ) {
            const t = ( await this.sign_in_unique_user() );
            token = t.token;
            creator_email = t.user_signin_credentials_dto.email;
        }
        const user = await this.users_service.get_by_email( creator_email );
        return {
            tag: await this.tags_service.create_tag( this.get_unique_create_tag_dto(), user ),
            creator: user,
            token: token,
        };
    }

    async create_application ( module: TestingModule ): Promise<INestApplication> {
        const app = module.createNestApplication();
        apply_middleware( app );
        await app.init();
        return app;
    }
}
