import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolYearsPageRoutingModule } from './school-years-routing.module';

import { SchoolYearsPage } from './school-years.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SchoolYearsPageRoutingModule
  ],
  declarations: [SchoolYearsPage]
})
export class SchoolYearsPageModule {}
