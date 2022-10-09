import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrintingDisplayPageRoutingModule } from './printing-display-routing.module';

import { PrintingDisplayPage } from './printing-display.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrintingDisplayPageRoutingModule
  ],
  declarations: [PrintingDisplayPage]
})
export class PrintingDisplayPageModule {}
