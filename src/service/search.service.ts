import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Ticket from '../entity/ticket.entity';
import TicketCountResult from '../interface/ticket-count-result.interface';
import TicketSearchBody from '../interface/ticket-search-body.interface';
import TicketSearchResult from '../interface/ticket-search-result.interface';

@Injectable()
export default class SearchService {
  index = 'tickets';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexTicket(Ticket: Ticket) {
    return this.elasticsearchService.index<
      TicketSearchResult,
      TicketSearchBody
    >({
      index: this.index,
      body: {
        id: Ticket.id,
        title: Ticket.title,
        content: Ticket.content,
      },
    });
  }

  async count(query: string, fields: string[]) {
    const { body } = await this.elasticsearchService.count<TicketCountResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });
    return body.count;
  }

  async search(text: string, offset?: number, limit?: number, startId = 0) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title', 'content']);
    }
    const { body } =
      await this.elasticsearchService.search<TicketSearchResult>({
        index: this.index,
        from: offset,
        size: limit,
        body: {
          query: {
            bool: {
              must: {
                multi_match: {
                  query: text,
                  fields: ['title', 'content'],
                },
              },
              filter: {
                range: {
                  id: {
                    gt: startId,
                  },
                },
              },
            },
          },
          sort: {
            _score: {
              order: 'desc',
            },
          },
        },
      });
    const count = body.hits.total.value;
    const hits = body.hits.hits;
    const results = hits.map((item) => item._source);
    return {
      count: startId ? separateCount : count,
      results,
    };
  }

  async remove(TicketId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: TicketId,
          },
        },
      },
    });
  }

  async update(Ticket: Ticket) {
    const newBody: TicketSearchBody = {
      id: Ticket.id,
      title: Ticket.title,
      content: Ticket.content,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: Ticket.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }
}
