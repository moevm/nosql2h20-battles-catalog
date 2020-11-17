import { Pipe, PipeTransform } from '@angular/core';
import { IActor } from '../../shared/interfaces/actor.interface';

@Pipe({
  name: 'armySizes'
})
export class ArmySizesPipe implements PipeTransform {
  transform(actors: IActor[]): number {
    return actors.reduce((sum, a) => sum += a.initial_state, 0);
  }
}
