import { Pipe, PipeTransform } from '@angular/core';
import { IActor } from '../../../shared/interfaces/actor.interface';

@Pipe({
  name: 'tooltipArmySizes'
})
export class TooltipArmySizesPipe implements PipeTransform {
  transform(actors: IActor[]): string {
    return actors.map(a => `${a.actor_name} - ${a.initial_state}`).join('\n');
  }
}
