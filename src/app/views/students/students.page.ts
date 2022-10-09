import { SchoolYear } from 'src/app/models';
/* eslint-disable curly */
import { PrintingDisplayPage } from './../printing-display/printing-display.page';
/* eslint-disable @typescript-eslint/dot-notation */
import { StudentService } from './../../services/student.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Card, ClassRoom, Establishment, Student } from 'src/app/models';
import { ClassRoomService, EstablishmentService, SchoolYearService } from 'src/app/services';
import { StudentFormComponent } from 'src/app/shared/forms/student-form/student-form.component';
import { StudentsComponent } from 'src/app/shared/list/students/students.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit, OnDestroy {

  students: Student[];
  classRoom: ClassRoom;
  establishment: Establishment;
  schoolYear: SchoolYear;
  routeSub: Subscription;
  dataSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private studentService: StudentService,
    private classRoomService: ClassRoomService,
    private schoolYearService: SchoolYearService,
    private establishmentService: EstablishmentService
  ) { }

  ngOnInit() {
    // this.classRoomService.clearData();
    this.dataSub = this.studentService.$data.subscribe(res => this.students = res);
    // this.route
    this.routeSub = this.route.params.subscribe(params => {
      this.schoolYear = this.schoolYearService.getByParam('id',params['schoolYearId']);
      this.establishment = this.establishmentService.getByParam('id', params['establishmentId']);
      this.classRoom = this.classRoomService.getByParam('id', params['classRoomId']);
      this.studentService.load(params['establishmentId'], params['schoolYearId'], params['classRoomId']);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.dataSub.unsubscribe();
  }

  onSelectAll() {
    let isChecked = true;
    if(this.students.filter(student => !student.isChecked).length === 0) isChecked = false;
    this.students.map(student => {
      student.isChecked = isChecked;
      return student;
    });
  }
  async onAdd() {
    const modal = await this.modalController.create({
      component: StudentFormComponent,
    });
    await modal.present();
  }

  async onPrint() {
    const cards: Card[] = this.students
    .filter(student => student.isChecked)
    .map<Card>( student => ({
      id: student.id,
      avatar: student.avatar,
      firstName: student.firstName,
      lastName: student.lastName,
      sex: student.sex,
      birthDate: student.birthDate,
      contact: student.phoneNumber,
      schoolYear: this.schoolYear.start + ' ' + this.schoolYear.end,
      establishmentName: this.establishment.name,
      level: this.classRoom.level,
      serie: this.classRoom.serie,
      managerSex: this.schoolYear.managerSex,
      managerName: this.schoolYear.managerName,
      signature: this.schoolYear.signature
    }));
    const modal = await this.modalController.create({
      component: StudentsComponent,
      cssClass: 'print',
      componentProps: { cards }
    });
    await modal.present();
  }

}
