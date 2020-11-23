import { IWar } from './war.interface';

export interface IWars {
  items: IWar[];
  total: number;
  current_page: number;
}
