import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictExceptionDto } from '../../dto/conflict_exception.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update_user.dto';
import { UserDto, UserWithTagsDto } from './dto/user.dto';
import { RequestWithUser, RequestWithUserAndTags } from './interfaces/request_with_user';
import { UsersService } from './users.service';

@ApiTags( 'Users' )
@Controller( 'user' )
export class UsersController {
    constructor ( private users_service: UsersService ) {}

    @ApiOperation( { summary: 'Return current user\'s data' } )
    @ApiBearerAuth()
    @Get( '' )
    @UseGuards( new JwtAuthGuard( true ) )
    @ApiOkResponse( { type: UserWithTagsDto } )
    get_me ( @Req() request: RequestWithUserAndTags ): UserWithTagsDto {
        return new UserWithTagsDto( request.user );
    }

    @ApiOperation( { summary: 'Update current user\'s data' } )
    @ApiBearerAuth()
    @Put( '' )
    @UseGuards( new JwtAuthGuard() )
    @ApiOkResponse( { type: UserDto } )
    @ApiConflictResponse( { type: ConflictExceptionDto } )
    async update_me ( @Body() update_user_dto: UpdateUserDto, @Req() request: RequestWithUser ): Promise<UserDto> {
        return new UserDto( await this.users_service.update_user( request.user.id, update_user_dto ) );
    }

    @ApiOperation( { summary: 'Delete current user\'s data' } )
    @ApiBearerAuth()
    @Delete( '' )
    @UseGuards( new JwtAuthGuard() )
    @ApiOkResponse()
    async delete_me ( @Req() request: RequestWithUser ) {
        await this.users_service.delete_user( request.user.id );
    }
}
