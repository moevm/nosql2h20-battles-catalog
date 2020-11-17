import { IWar } from './war.interface';

export interface IWars {
  wars: IWar[];
  total: number;
  current_page: number;
}
