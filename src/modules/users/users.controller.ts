import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UserWithTagsDto } from './dto/user.dto';
import { RequestWithUserAndTags } from './interfaces/request_with_user';

@ApiTags( 'Users' )
@Controller( 'user' )
export class UsersController {
    @ApiOperation( { summary: 'Returns current user data' } )
    @ApiBearerAuth()
    @Get( '' )
    @UseGuards( new JwtAuthGuard( true ) )
    @ApiOkResponse( { type: UserWithTagsDto } )
    get_me ( @Req() request: RequestWithUserAndTags ): UserWithTagsDto {
        return new UserWithTagsDto( request.user );
    }
}
