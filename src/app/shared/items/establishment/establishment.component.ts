import { EstablishmentInfosComponent } from './../../details/establishment-infos/establishment-infos.component';
import { Router } from '@angular/router';
import { AlertService } from './../../../services/alert.service';
/* eslint-disable curly */
import { EstablishmentService } from './../../../services/establishment.service';
import { Establishment, SchoolYear } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { EstablishmentFormComponent } from '../../forms/establishment-form/establishment-form.component';
import { SchoolYearService } from 'src/app/services';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html',
  styleUrls: ['./establishment.component.scss'],
})
export class EstablishmentComponent implements OnInit {

  @Input() data: Establishment;
  schoolYears: SchoolYear[] = [];
  schoolYearId: string;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private establishmentService: EstablishmentService,
  ) { }

  ngOnInit() {
   }

   displayYears() {
     this.router.navigate(['app/school-years', this.data.id]);
   }

  async onEdit() {
    const modal = await this.modalController.create({
      component: EstablishmentFormComponent,
      componentProps: {
        id: this.data.id
      }
    });

    await modal.present();
  }

async   onDisplay() {
  const modal = await this.modalController.create({
  component: EstablishmentInfosComponent,
  componentProps: { id: this.data.id }
  });

  await modal.present();

}

  async onDelete() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Voulez-vous  <strong>supprimer</strong> cet etablissement?',
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
          handler: async () => {
            console.log('Confirm Okay');
            const loading = await this.loadingController.create({
              message: 'Suppression',
              duration: 30000,
              spinner: 'bubbles'
            });
            await loading.present();
            await this.establishmentService.delete(this.data.id);
            loading.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }



}
