/* eslint-disable curly */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(arr: any[], arg: string, value: string): any[] {
    if (!arr) return [];
    if (!arg) return arr;
    if (!value) return arr;
    return arr.filter(item => item[arg].toLowerCase().includes(value.toLowerCase()));
  }

}
