import { SchoolYearFormComponent } from './forms/school-year-form/school-year-form.component';
import { CropImageComponent } from './utils/crop-image/crop-image.component';
import { ModalHeaderComponent } from './utils/modal-header/modal-header.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { SchoolYearComponent } from './items/school-year/school-year.component';
import { EstablishmentInfosComponent } from './details/establishment-infos/establishment-infos.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstablishmentFormComponent } from './forms/establishment-form/establishment-form.component';
import { ClassRoomFormComponent } from './forms/class-room-form/class-room-form.component';
import { StudentFormComponent } from './forms/student-form/student-form.component';
import { ClassRoomInfosComponent } from './details/class-room-infos/class-room-infos.component';
import { StudentInfosComponent } from './details/student-infos/student-infos.component';
import { EstablishmentComponent } from './items/establishment/establishment.component';
import { ClassRoomComponent } from './items/class-room/class-room.component';
import { StudentComponent } from './items/student/student.component';
import { CardComponent } from './items/card/card.component';
import { HeaderComponent } from './utils/header/header.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { StudentsComponent } from './list/students/students.component';

const forms = [
  EstablishmentFormComponent,
  SchoolYearFormComponent,
  ClassRoomFormComponent,
  StudentFormComponent
];

const details = [
  EstablishmentInfosComponent,
  ClassRoomInfosComponent,
  StudentInfosComponent
];

const list = [
  StudentsComponent
];

const items = [
  EstablishmentComponent,
  SchoolYearComponent,
  ClassRoomComponent,
  StudentComponent,
  CardComponent
];

const utils = [
  HeaderComponent,
  ModalHeaderComponent,
  CropImageComponent
];

@NgModule({
  declarations: [...forms, ...details, ...list, ...items, ...utils],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    AngularSignaturePadModule,
  ],
  exports: [...forms, ...details, ...list, ...items, ...utils]
})
export class SharedModule { }
