/* eslint-disable curly */
import { EstablishmentService } from './../../services/establishment.service';
import { Component, OnInit } from '@angular/core';
import { Establishment } from 'src/app/models';
import { ModalController } from '@ionic/angular';
import { EstablishmentFormComponent } from 'src/app/shared/forms/establishment-form/establishment-form.component';

@Component({
  selector: 'app-establishments',
  templateUrl: './establishments.page.html',
  styleUrls: ['./establishments.page.scss'],
})
export class EstablishmentsPage implements OnInit {

  establishments: Establishment[] = [];

  constructor(
    private modalController: ModalController,
    private establishmentService: EstablishmentService
  ) { }

  ngOnInit() {
    this.establishmentService.$data.subscribe( res =>  this.establishments = res );
  }

  async onAdd() {
    const modal = await this.modalController.create({
      component: EstablishmentFormComponent,
    });

    await modal.present();
  }

}
