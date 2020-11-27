import { Pipe, PipeTransform } from '@angular/core';
import { IActor } from '../../../shared/interfaces/actor.interface';

@Pipe({
  name: 'tooltipActors'
})
export class TooltipActorsPipe implements PipeTransform {
  transform(actors: IActor[]): string {
    return actors.map(a => a.actor_name).join('\n');
  }
}
