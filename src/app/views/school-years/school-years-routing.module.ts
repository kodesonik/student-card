import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolYearsPage } from './school-years.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolYearsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolYearsPageRoutingModule {}
