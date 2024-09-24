import TicketSearchBody from './ticket-search-body.interface';

interface TicketSearchResult {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: TicketSearchBody;
    }>;
  };
}

export default TicketSearchResult;
