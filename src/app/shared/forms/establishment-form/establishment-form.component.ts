import { AlertService } from './../../../services/alert.service';
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { Sex } from './../../../types/sex';
import { UploadService } from './../../../services/upload.service';
import { Establishment } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { EstablishmentService } from 'src/app/services';

@Component({
  selector: 'app-establishment-form',
  templateUrl: './establishment-form.component.html',
  styleUrls: ['./establishment-form.component.scss'],
})
export class EstablishmentFormComponent implements OnInit {

  @Input() id: string;

  logo;

  data: Establishment = {
    logo: null,
    inspection: '',
    name: '',
    phoneNumber: '',
    phoneNumber2: null,
    address: '',
    poBOX: '',
  };

  SEX = Sex;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private establishmentService: EstablishmentService,
    private uploadService: UploadService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.data = this.establishmentService.getByParam('id', this.id);
    }
  }

  onSelectFile(event) {
    this.logo = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.data.logo = event.target.result;
    };

    reader.onerror = (event: any) => {
      console.log('File could not be read: ' + event.target.error.code);
    };

    reader.readAsDataURL(event.target.files[0]);
  }


  async onValidate() {
    const loading = await this.loadingController.create({
      message: 'Ajout de l\'etablissement...',
      duration: 30000,
      spinner: 'bubbles'
    });
    await loading.present();
    // upload logo
    if(this.logo) {
      loading.message = 'Upload du logo  en cours ...';
      try {
        this.data.logo = await this.uploadService.postFile('logo/', this.logo);
      } catch(err) {
        console.log(err.message);
        this.alertService.presentToastError('Eche de l\'upload du logo!');
      }
    }

    // save data
    if(!this.id) await this.establishmentService.add(this.data);
    else await this.establishmentService.edit({id: this.id, ...this.data});
    loading.dismiss();
    this.alertService.presentToastSuccess('Ajoute avec success!!!');
    this.onClose();
  }

  onClose() {
    this.modalController.dismiss();
  }

}
