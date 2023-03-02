
export default class IndexStatisticsResponse {
  secret: string;
  user: string;

  constructor(init?: IndexStatisticsResponse) {
    this.secret = init?.secret ?? '';
    this.user = init?.user ?? '';
  }
}

export interface IndexStatisticsResponseProps {
  secret: string
  user: string
}