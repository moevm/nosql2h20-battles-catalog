import { Pipe, PipeTransform } from '@angular/core';
import { IWar } from '../interfaces/war.interface';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(war: IWar): string {
    if (!war.datetime_min || !war.datetime_max) {
      return '';
    }

    const start = new Date(war.datetime_min).getFullYear();
    const end = new Date(war.datetime_max).getFullYear();
    const diff = end - start;

    // @ts-ignore
    return diff ? diff.toString() : '<1';
  }
}
