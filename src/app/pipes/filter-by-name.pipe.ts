/* eslint-disable curly */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName'
})
export class FilterByNamePipe implements PipeTransform {


  transform(arr: any[], value: string): any[] {
    if (!arr) return [];
    if (!value) return arr;
    return arr.filter(item => item.firstName.toLowerCase().includes(value.toLowerCase())
    || item.lastName.toLowerCase().includes(value.toLowerCase())
    || item?.phoneNumber.includes(value)
    // || item?.address.toLowerCase().includes(value.toLowerCase())
    );
  }

}
