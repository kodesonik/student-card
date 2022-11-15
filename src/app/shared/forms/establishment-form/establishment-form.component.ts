import { Level, Serie } from 'src/app/types';
import { AlertService } from './../../../services/alert.service';
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { Sex } from './../../../types/sex';
import { UploadService } from './../../../services/upload.service';
import { Establishment, Card } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CardService, EstablishmentService } from 'src/app/services';

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
    cardTheme: 'default'
  };

  SEX = Sex;

  themes: any[];

  defaultStudent: Card = {
    logo: null,
    id: '123456',
    avatar: null,
    firstName: 'AMA',
    lastName: 'Kwatcha',
    sex: 'M',
    birthDate: '01/01/2000',
    birthPlace: 'Dapaong',
    birthCountry: 'Togo',
    contact: '90000000',
    schoolYear: 2022 + ' ' + 2024,
    establishmentName: 'Lycee TEST',
    establishmentContact: '99009900',
    level:  Level.END,
    serie: Serie.D,
    classNum: '1',
    managerSex: 'Mme',
    managerName: 'ABALO Afi',
    signature: null
  };

  slideOpts ={
    // slidePerview: 2
    centeredSlides: true,
    loop: true,
    paginationType: 'fraction',
    spaceBetween: 50
  };

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private establishmentService: EstablishmentService,
    private uploadService: UploadService,
    private alertService: AlertService,
    private cardService: CardService,
  ) { }

  ngOnInit() {
    if (this.id) {
      this.data = this.establishmentService.getByParam('id', this.id);
    }
    this.themes = this.cardService.themes;
    console.log(this.themes, 'thems');
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
