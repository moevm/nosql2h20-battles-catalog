import { IActor } from '../../shared/interfaces/actor.interface';

export interface IWar {
  actors: IActor[];
  datetime_min: string;
  datetime_max: string;
  name: string;
  battles_num: number;
}
