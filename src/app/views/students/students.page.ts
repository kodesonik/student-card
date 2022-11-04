import { SchoolYear } from 'src/app/models';
/* eslint-disable curly */
import { PrintingDisplayPage } from './../printing-display/printing-display.page';
/* eslint-disable @typescript-eslint/dot-notation */
import { StudentService } from './../../services/student.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Card, ClassRoom, Establishment, Student } from 'src/app/models';
import { CardService, ClassRoomService, EstablishmentService, SchoolYearService, SeedService } from 'src/app/services';
import { StudentFormComponent } from 'src/app/shared/forms/student-form/student-form.component';
import { StudentsComponent } from 'src/app/shared/list/students/students.component';
import { StudentInfosComponent } from 'src/app/shared/details/student-infos/student-infos.component';

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
  searchValue = '';

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private alertController: AlertController,
    private studentService: StudentService,
    private classRoomService: ClassRoomService,
    private schoolYearService: SchoolYearService,
    private establishmentService: EstablishmentService,
    private cardService: CardService,
    private seedService: SeedService
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
    if(this.students.filter(student => !student.isChecked).length === 0) {
      this.students.map(student => {
        student.isChecked = false;
        this.cardService.removeCard(student.id);
        return student;
      });
      return;
    }
    this.students.map(student => {
      student.isChecked = true;
      const studentCard = {
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
      };
      this.cardService.addCard(studentCard);
      return student;
    });
  }

  async onAdd() {
    const modal = await this.modalController.create({
      component: StudentFormComponent,
      componentProps: {
        establishmentId: this.establishment.id,
        schoolYearId: this.schoolYear.id
      }
    });
    await modal.present();
  }

  async onEdit(id: string) {
    const modal = await this.modalController.create({
      component: StudentFormComponent,
      componentProps: {
        id,
        establishmentId: this.establishment.id,
        schoolYearId: this.schoolYear.id
      }
    });
    await modal.present();
  }

  async onDisplayInfos(id) {
    const modal = await this.modalController.create({
    component: StudentInfosComponent,
    componentProps: { id }
    });
    await modal.present();
  }


  async onDelete(id) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Voulez-vous  <strong>supprimer</strong> cet eleve?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Supprimer',
          handler: () => {
            console.log('Confirm Okay');
            this.studentService.delete(id);
          }
        }
      ]
    });

    await alert.present();
  }

  onCheck(ev: boolean, student: Student) {
    if (!ev) return this.cardService.removeCard(student.id);
    const studentCard = {
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
    };
    this.cardService.addCard(studentCard);
  }


  onSeed(ev){
    const file = ev.target.files[0];
    console.log(file);
   if(file) this.seedService.seedClassroom(file, this.classRoom.id);
  }

}
