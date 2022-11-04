import { Pipe, PipeTransform } from '@angular/core';
import { orderBy, sortBy } from 'lodash';

@Pipe({
  name: 'order'
})
export class OrderPipe implements PipeTransform {

  transform(array: any, args: string[], order?: string): any[] {
    const sortOrder = order ? order : 'asc'; // setting default ascending order

    return sortBy(array, args, [sortOrder]);
  }

}
