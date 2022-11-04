import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintCardsPage } from './print-cards.page';

const routes: Routes = [
  {
    path: '',
    component: PrintCardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintCardsPageRoutingModule {}
