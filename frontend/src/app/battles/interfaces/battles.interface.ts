import { IBattle } from './battle.interface';

export interface IBattles {
  items: IBattle[];
  total: number;
  current_page: number;
}
