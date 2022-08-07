import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForbiddenExceptionDto } from '../../dto/forbidden_exception.dto';
import { NotFoundExceptionDto } from '../../dto/not_found_exception.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../users/interfaces/request_with_user';
import { CreateTagDto } from './dto/create_tag.dto';
import { ListTagsQueryDto } from './dto/list_tags_query.dto';
import { TagDto, TagWithCreatorDto } from './dto/tag.dto';
import { TagsListSortedDto } from './dto/tags_list_sorted.dto';
import { UpdateTagDto } from './dto/update_tag.dto';
import { TagsService } from './tags.service';

@ApiTags( 'Tags' )
@Controller( 'tag' )
export class TagsController {
    constructor ( private tags_service: TagsService ) {}


    @ApiOperation( { summary: 'Create new tag' } )
    @ApiBearerAuth()
    @Post()
    @UseGuards( new JwtAuthGuard() )
    @ApiCreatedResponse( { type: TagDto } )
    async create_tag ( @Body() create_tag_dto: CreateTagDto, @Req() request: RequestWithUser ): Promise<TagDto> {
        return new TagDto( await this.tags_service.create_tag( create_tag_dto, request.user ) );
    }


    @ApiOperation( { summary: 'Return tag by id' } )
    @ApiBearerAuth()
    @Get( ':id' )
    @UseGuards( new JwtAuthGuard() )
    @ApiOkResponse( { type: TagWithCreatorDto } )
    @ApiNotFoundResponse( { type: NotFoundExceptionDto } )
    async get_tag_by_id ( @Param( 'id', new ParseIntPipe() ) id: number ): Promise<TagWithCreatorDto> {
        const ret = await this.tags_service.get_tag_by_id( id )
            .then( ( val ) => {
                if ( val == null ) {
                    throw new NotFoundExceptionDto( { name: 'id', value: id } );
                }
                return val;
            } );
        return new TagWithCreatorDto( ret );
    }


    @ApiOperation( { summary: 'Return all tags with ordering and pagination' } )
    @ApiBearerAuth()
    @Get()
    @UseGuards( new JwtAuthGuard() )
    @ApiOkResponse( { type: TagsListSortedDto } )
    async get_all_tags ( @Query() query: ListTagsQueryDto ): Promise<TagsListSortedDto> {
        const sort_by_order: boolean = query.sortByOrder !== undefined;
        const sort_by_name: boolean = query.sortByName !== undefined;
        const offset = query.offset || 0;
        const length = query.length || -1;
        const tags = await this.tags_service.get_all_sorted( sort_by_order, sort_by_name, offset, length );
        return new TagsListSortedDto( tags.tags, tags.count, offset );
    }


    @ApiOperation( { summary: 'Update tag by id' } )
    @ApiBearerAuth()
    @Put( ':id' )
    @UseGuards( new JwtAuthGuard() )
    @ApiOkResponse( { type: TagWithCreatorDto } )
    @ApiNotFoundResponse( { type: NotFoundExceptionDto } )
    @ApiForbiddenResponse( { type: ForbiddenExceptionDto } )
    async update_tag_by_id ( @Body() update_tag_dto: UpdateTagDto, @Param( 'id', new ParseIntPipe() ) id: number, @Req() request: RequestWithUser ): Promise<TagWithCreatorDto> {
        // It is fine without transaction since creator cannot be changed
        const tag = await this.tags_service.get_tag_by_id( id )
            .then( ( val ) => {
                if ( val == null ) {
                    throw new NotFoundExceptionDto( { name: 'id', value: id } );
                }
                return val;
            } );
        if ( tag.created_by.id != request.user.id ) {
            throw new ForbiddenExceptionDto( 'Only creator can update tag' );
        }
        return new TagWithCreatorDto( await this.tags_service.update_tag( id, update_tag_dto ) );
    }


    @ApiOperation( { summary: 'Delete tag by id' } )
    @ApiBearerAuth()
    @Delete( ':id' )
    @UseGuards( new JwtAuthGuard() )
    @ApiOkResponse()
    @ApiNotFoundResponse( { type: NotFoundExceptionDto } )
    @ApiForbiddenResponse( { type: ForbiddenExceptionDto } )
    async delete_tag_by_id ( @Param( 'id', new ParseIntPipe() ) id: number, @Req() request: RequestWithUser ): Promise<void> {
        // It is fine without transaction since creator cannot be changed
        const tag = await this.tags_service.get_tag_by_id( id )
            .then( ( val ) => {
                if ( val == null ) {
                    throw new NotFoundExceptionDto( { name: 'id', value: id } );
                }
                return val;
            } );
        if ( tag.created_by.id != request.user.id ) {
            throw new ForbiddenExceptionDto( 'Only creator can delete tag' );
        }
        await this.tags_service.delete_tag( id );
    }
}
