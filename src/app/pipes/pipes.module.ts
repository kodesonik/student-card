import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { OrderPipe } from './order.pipe';
import { FilterByNamePipe } from './filter-by-name.pipe';

const pipes = [
  OrderPipe,
  FilterPipe,
  FilterByNamePipe
];


@NgModule({
  declarations: [...pipes],
  imports: [
    CommonModule
  ],
  exports: [...pipes]
})
export class PipesModule { }
