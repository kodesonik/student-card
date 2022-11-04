import { PipesModule } from './../../pipes/pipes.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassRoomsPageRoutingModule } from './class-rooms-routing.module';

import { ClassRoomsPage } from './class-rooms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassRoomsPageRoutingModule,
    PipesModule,
    SharedModule
  ],
  declarations: [ClassRoomsPage]
})
export class ClassRoomsPageModule {}
