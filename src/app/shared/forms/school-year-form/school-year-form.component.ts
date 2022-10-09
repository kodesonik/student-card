import { UploadService } from 'src/app/services';
/* eslint-disable curly */
import { SchoolYear } from 'src/app/models';
/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertService, SchoolYearService } from 'src/app/services';
import { Sex } from 'src/app/types';
import { SignaturePadComponent, NgSignaturePadOptions } from '@almothafar/angular-signature-pad';

@Component({
  selector: 'app-school-year-form',
  templateUrl: './school-year-form.component.html',
  styleUrls: ['./school-year-form.component.scss'],
})
export class SchoolYearFormComponent implements OnInit, AfterViewInit {


  @Input() id: string;
  @ViewChild('signatureRef') signaturePad: SignaturePadComponent;

  data: SchoolYear = {
    start: null,
    end: null,
    managerName: '',
    managerSex: null,
    signature: ''
  };

  SEX = Sex;

  signature: string;

  signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 2,
    canvasWidth: 500,
    canvasHeight: 200
  };

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertService: AlertService,
    private schoolYearService: SchoolYearService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.data = this.schoolYearService.getByParam('id', this.id);
    }
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 3); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawClear() {
    this.signaturePad.clear();
  }


  async onValidate() {
    const loading = await this.loadingController.create({
      message: 'Ajout de l\'etablissement...',
      duration: 30000,
      spinner: 'bubbles'
    });
    await loading.present();
    // upload logo
    if (this.signature) {
      loading.message = 'Upload de la signature  en cours ...';
      try {
        this.data.signature = await this.uploadService.post('signature/', this.signature);
      } catch (err) {
        console.log(err.message);
        this.alertService.presentToastError('Eche de l\'upload de la signature!');
      }
    }

    // save data
    this.data.end = this.data.start + 1;
    if (!this.id) await this.schoolYearService.add(this.data);
    else await this.schoolYearService.edit({ id: this.id, ...this.data });
    loading.dismiss();
    this.alertService.presentToastSuccess('Ajoute avec success!!!');
    this.onClose();
  }

  drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event
    console.log('Completed drawing', event);
    console.log(this.signaturePad.toDataURL());
    this.signature = this.signaturePad.toDataURL();
  }

  drawStart(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('Start drawing', event);
  }

  onClose() {
    this.modalController.dismiss();
  }
}
