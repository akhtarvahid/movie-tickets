import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import Ticket from '../entity/ticket.entity';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import TicketService from '../service/ticket.service';
import CreateTicketDto from '../dto/create-ticket.dto';
import UpdateTicketDto from '../dto/update-ticket.dto';
import PaginationParamsDto from '../dto/results-ticket.dto';

@Controller('ticket')
@ApiTags('ticket')
export default class TicketController {
  constructor(private readonly TicketService: TicketService) {}

  @Get()
  async getPosts(
    @Query('search') search: string,
    @Query() query: PaginationParamsDto,
  ) {
    const { limit, offset, startId } = query;

    if (search) {
      return this.TicketService.searchForPosts(search, offset, limit, startId);
    }
    return this.TicketService.getPostsWithAuthors(offset, limit, startId);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a post that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A post has been successfully fetched',
    type: Ticket,
  })
  @ApiResponse({
    status: 404,
    description: 'A post with given id does not exist.',
  })
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.TicketService.getPostById(Number(id));
  }

  @Post()
  async createPost(@Body() body: CreateTicketDto) {
    return this.TicketService.createPost(body);
  }

  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTicketDto,
  ) {
    return this.TicketService.updatePost(Number(id), body);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.TicketService.deletePost(Number(id));
  }
}
