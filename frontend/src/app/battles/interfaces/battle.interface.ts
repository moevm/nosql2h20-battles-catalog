import { IActor } from '../../shared/interfaces/actor.interface';

export interface IBattle {
  battle_id: number;
  actors: IActor[];
  datetime_min: string;
  datetime_max: string;
  name: string;
  war: string;
}
