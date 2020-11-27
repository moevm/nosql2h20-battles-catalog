export interface IBattlesQuery {
  page: number;
  limit: number;
  sort?: string;
  sort_dir?: number;
  name?: string[];
  actors?: string[];
  war?: string[];
  search?: string;
}
