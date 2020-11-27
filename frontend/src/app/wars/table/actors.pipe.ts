import { Pipe, PipeTransform } from '@angular/core';
import { IActor } from '../../shared/interfaces/actor.interface';

@Pipe({
  name: 'actors'
})
export class ActorsPipe implements PipeTransform {
  transform(actors: IActor[]): string {
    return actors.map(a => a.actor_name).join(', ');
  }
}
