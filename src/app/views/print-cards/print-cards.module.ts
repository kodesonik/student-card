import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrintCardsPageRoutingModule } from './print-cards-routing.module';

import { PrintCardsPage } from './print-cards.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PrintCardsPageRoutingModule
  ],
  declarations: [PrintCardsPage]
})
export class PrintCardsPageModule {}
