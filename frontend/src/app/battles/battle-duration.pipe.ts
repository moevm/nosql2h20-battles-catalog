import { Pipe, PipeTransform } from '@angular/core';
import { IBattle } from './interfaces/battle.interface';

@Pipe({
  name: 'battleDuration'
})
export class BattleDurationPipe implements PipeTransform {
  transform(battle: IBattle): string {
    if (!battle.datetime_min || !battle.datetime_max) {
      return '';
    }

    const start = new Date(battle.datetime_min);
    const end = new Date(battle.datetime_max);
    // @ts-ignore
    const diff = (end - start) / 1000 / 60 / 60;

    // @ts-ignore
    return diff >= 1 ? Math.round(diff).toString() : '<1';
  }
}
