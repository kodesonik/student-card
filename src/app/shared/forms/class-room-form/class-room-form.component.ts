/* eslint-disable @typescript-eslint/naming-convention */
import { AlertService } from './../../../services/alert.service';
import { ClassRoom } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';
import { ClassRoomService } from 'src/app/services';
import { LoadingController, ModalController } from '@ionic/angular';
import { Level, Serie } from 'src/app/types';

@Component({
  selector: 'app-class-room-form',
  templateUrl: './class-room-form.component.html',
  styleUrls: ['./class-room-form.component.scss'],
})
export class ClassRoomFormComponent implements OnInit {

  @Input() id: string;

  data: ClassRoom = {
    level: null,
    serie: null,
    num: null
  };

  LEVEL = Level;
  SERIE = Serie;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private classRoomService: ClassRoomService,
    private alertService: AlertService
  ) { }

  ngOnInit() {}

  async onValidate() {
    const loading = await this.loadingController.create({
      message: 'Ajout de la classe...',
      duration: 30000,
      spinner: 'bubbles'
    });
    await loading.present();

    // save data

    await this.classRoomService.add(this.data);
    loading.dismiss();
    this.alertService.presentToastSuccess('Ajoute avec success!!!');
    this.onClose();
  }

  onClose() {
    this.modalController.dismiss();
  }

}
