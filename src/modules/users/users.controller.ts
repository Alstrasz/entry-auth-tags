import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictExceptionDto } from '../../dto/conflict_exception.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagsListDto } from '../tags/dto/tags_list.dto';
import { ConnectTagsDto } from './dto/connect_tags.dto';
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

    @ApiOperation( { summary: 'Assign tags to current user' } )
    @ApiBearerAuth()
    @Post( 'tag' )
    @UseGuards( new JwtAuthGuard( true ) )
    @ApiOkResponse( { type: TagsListDto } )
    async assign_tags_to_me ( @Body() conect_tags_dto: ConnectTagsDto, @Req() request: RequestWithUser ): Promise<TagsListDto> {
        return new TagsListDto( ( await this.users_service.connect_tags( request.user.id, conect_tags_dto.tags ) ).tags );
    }

    @ApiOperation( { summary: 'Unssign tag for current user' } )
    @ApiBearerAuth()
    @Delete( 'tag/:tag_id' )
    @UseGuards( new JwtAuthGuard( true ) )
    @ApiOkResponse( { type: TagsListDto } )
    async unassign_tag_for_me ( @Param( 'tag_id', new ParseIntPipe() ) tag_id: number, @Req() request: RequestWithUser ): Promise<TagsListDto> {
        return new TagsListDto( ( await this.users_service.unassign_tag( request.user.id, tag_id ) ).tags );
    }

    @ApiOperation( { summary: 'Return all tags created by user' } )
    @ApiBearerAuth()
    @Get( 'tag/my' )
    @UseGuards( new JwtAuthGuard( true ) )
    @ApiOkResponse( { type: UserWithTagsDto } )
    async get_my_tags ( @Req() request: RequestWithUserAndTags ): Promise<TagsListDto> {
        return new TagsListDto( ( await this.users_service.get_by_id( request.user.id, 'created' ) ).created_tags );
    }
}
