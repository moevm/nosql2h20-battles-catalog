import { Pipe, PipeTransform } from '@angular/core';
import { IActor } from '../../../shared/interfaces/actor.interface';

@Pipe({
  name: 'tooltipArmyLosses'
})
export class TooltipArmyLossesPipe implements PipeTransform {
  transform(actors: IActor[]): string {
    return actors.map(a => `${a.actor_name} - ${a.casualties}`).join('\n');
  }
}
