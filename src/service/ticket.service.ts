import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import SearchService from './search.service';
import { MoreThan, FindManyOptions } from 'typeorm';
import Ticket from '../entity/ticket.entity';
import CreateTicketDto from '../dto/create-ticket.dto';
import UpdateTicketDto from '../dto/update-ticket.dto';

@Injectable()
export default class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private postsRepository: Repository<Ticket>,
    private searchService: SearchService,
  ) {}

  async getPosts(
    offset?: number,
    limit?: number,
    startId?: number,
    options?: FindManyOptions<Ticket>,
  ) {
    const where: FindManyOptions<Ticket>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }

    const [items, count] = await this.postsRepository.findAndCount({
      where,
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
      ...options,
    });

    return {
      items,
      count: startId ? separateCount : count,
    };
  }

  async getPostsWithAuthors(offset?: number, limit?: number, startId?: number) {
    return this.getPosts(offset, limit, startId);
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (post) {
      return post;
    }
    Logger.warn('Tried to access a post that does not exist');
    throw new NotFoundException(`Post with id ${id} not found`);
  }

  async createPost(body: CreateTicketDto) {
    const newPost = await this.postsRepository.create(body);
    await this.postsRepository.save(newPost);
    this.searchService.indexTicket(newPost);
    return newPost;
  }

  async updatePost(id: number, post: UpdateTicketDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({
      where: {
        id,
      },
    });
    if (updatedPost) {
      await this.searchService.update(updatedPost);
      return updatedPost;
    }
    throw new NotFoundException(`Post with id ${id} not found`);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    await this.searchService.remove(id);
  }

  async searchForPosts(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    const { results, count } = await this.searchService.search(
      text,
      offset,
      limit,
      startId,
    );
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return {
        items: [],
        count,
      };
    }
    const items = await this.postsRepository.find({
      where: { id: In(ids) },
    });
    return {
      items,
      count,
    };
  }
}
