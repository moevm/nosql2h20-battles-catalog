import { Pipe, PipeTransform } from '@angular/core';
import { IActor } from '../../shared/interfaces/actor.interface';

@Pipe({
  name: 'battleTooltipArmySizes'
})
export class BattleTooltipArmySizesPipe implements PipeTransform {
  transform(actors: IActor[]): string {
    return actors.map(a => `${a.actor_name} ${a.is_winner ? '(winner)' : ''}\n\t${a.army_name} - ${a.initial_state}`)
      .join('\n\n');
  }
}
