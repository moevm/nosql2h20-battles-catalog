import { Pipe, PipeTransform } from '@angular/core';
import { IActor } from '../../shared/interfaces/actor.interface';

@Pipe({
  name: 'battleTooltipActors'
})
export class BattleTooltipActorsPipe implements PipeTransform {
  transform(actors: IActor[]): string {
    return actors
      .map(a => `${a.actor_name} ${a.is_winner ? '(winner)' : ''}\n\t${a.army_name} - ${a.commander}`)
      .join('\n\n');
  }
}
