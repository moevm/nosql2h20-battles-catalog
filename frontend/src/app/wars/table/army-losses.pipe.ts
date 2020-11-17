import { Pipe, PipeTransform } from '@angular/core';
import { IActor } from '../../shared/interfaces/actor.interface';

@Pipe({
  name: 'armyLosses'
})
export class ArmyLossesPipe implements PipeTransform {
  transform(actors: IActor[]): number {
    return actors.reduce((sum, a) => sum += a.casualties, 0);
  }
}
