import { ClassRoomFormComponent } from 'src/app/shared/forms/class-room-form/class-room-form.component';
import { AlertService } from './../../../services/alert.service';
/* eslint-disable curly */
import { Router } from '@angular/router';
import { ClassRoom } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';
import { ClassRoomService } from 'src/app/services';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss'],
})
export class ClassRoomComponent implements OnInit {

  @Input() data: ClassRoom;
  @Input() establishmentId: string;
  @Input() schoolYearId: string;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private classRoomService: ClassRoomService,
    private alertService: AlertService
  ) { }

  ngOnInit() {}

  async onEdit() {
    const modal = await this.modalController.create({
      component: ClassRoomFormComponent,
      componentProps: {
        id: this.data.id
      }
    });

    await modal.present();
  }


  async onDelete() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Voulez-vous  <strong>supprimer</strong> cette classe?',
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
            this.classRoomService.delete(this.data.id);
          }
        }
      ]
    });

    await alert.present();
  }

  onDisplayStudents() {
    if (!this.schoolYearId) return this.alertService.presentToastError('Choississez d\'abord une annee scolaire!');

    this.router.navigate(['app/students', this.establishmentId, this.schoolYearId, this.data.id]);
  }

}
