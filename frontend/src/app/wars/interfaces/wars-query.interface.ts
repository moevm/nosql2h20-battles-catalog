export interface IWarsQuery {
  page: number;
  limit: number;
  sort?: string;
  sort_dir?: number;
  name?: string[];
  actors?: string[];
  search?: string;
}
