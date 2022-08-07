import { Body, Controller, HttpCode, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ConflictExceptionDto } from '../../dto/conflict_exception.dto';
import { RequestWithUser } from '../users/interfaces/request_with_user';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access_token.dto';
import { UserLoginCredentialsDto } from './dto/user_login_credentials.dto';
import { UserSigninCredentialsDto } from './dto/user_signin_credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags( 'Auth' )
@Controller( '' )
export class AuthController {
    constructor (
        private auth_service: AuthService,
    ) {}

    @ApiOperation( { summary: 'Determines user by email/password pair and issues jwt token' } )
    @UseGuards( LocalAuthGuard )
    @Post( 'login' )
    @HttpCode( 200 )
    @ApiOkResponse( { type: AccessTokenDto } )
    @ApiUnauthorizedResponse()
    async login ( @Body() _user_credentials_dto: UserLoginCredentialsDto, @Request() req: RequestWithUser ) {
        return new AccessTokenDto( this.auth_service.login( req.user ) );
    }

    @ApiOperation( { summary: 'Creates user by username/password pair and issues jwt token' } )
    @Post( 'signin' )
    @ApiCreatedResponse( { type: AccessTokenDto } )
    @ApiConflictResponse( { type: ConflictExceptionDto } )
    async signin ( @Body() user_signin_credentials_dto: UserSigninCredentialsDto ) {
        return new AccessTokenDto( await this.auth_service.signin( user_signin_credentials_dto ) );
    }

    @ApiOperation( {
        summary: '(supposently) logsout user by invalidating token',
        description: 'Proposed simple jwt bearer auth does not support any robust way of invalidating tokens.' +
            'Access refresh tokens requiered for that. Considering limitations... Just pretending not to track this user anymore -)',
    } )
    @ApiBearerAuth()
    @Post( 'logout' )
    @UseGuards( new JwtAuthGuard() )
    @HttpCode( 200 )
    @ApiOkResponse( { type: AccessTokenDto } )
    async logout () {
        // Simple JWT bearer auth does not support any robust logout. Access refresh tokens requiered for that.
        // Considering limitations... Just pretending not to track this user anymore -)
    }
}
