import { StudentInfosComponent } from './../../details/student-infos/student-infos.component';
/* eslint-disable curly */
import { StudentFormComponent } from 'src/app/shared/forms/student-form/student-form.component';
import { Student } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';
import { AlertService, StudentService } from 'src/app/services';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {

  @Input() data: Student;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private studentService: StudentService,
    private alertService: AlertService
  ) { }

  ngOnInit() {}

  async onEdit() {
    const modal = await this.modalController.create({
      component: StudentFormComponent,
      componentProps: {
        id: this.data.id
      }
    });

    await modal.present();
  }

  async onDelete() {
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
            this.studentService.delete(this.data.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async onDisplayInfos() {
    const modal = await this.modalController.create({
    component: StudentInfosComponent,
    componentProps: { id: this.data.id }
    });
    await modal.present();
  }
}
