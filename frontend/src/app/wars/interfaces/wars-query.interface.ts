export interface IWarsQuery {
  page: number;
  limit: number;
  sort?: string;
  names?: string[];
  actors?: string[];
}
