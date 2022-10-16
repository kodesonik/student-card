import { EstablishmentFormComponent } from './../../forms/establishment-form/establishment-form.component';
import { Establishment } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { EstablishmentService } from 'src/app/services';

@Component({
  selector: 'app-establishment-infos',
  templateUrl: './establishment-infos.component.html',
  styleUrls: ['./establishment-infos.component.scss'],
})
export class EstablishmentInfosComponent implements OnInit {
  @Input() id: string;

  data: Establishment;
  stats = {
    schoolYearsCount: null,
    classRoomsCount: null,
    studentsCount: null
  };

  manager: any;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private establishmentService: EstablishmentService
  ) { }

  ngOnInit() {
    this.data = this.establishmentService.getByParam('id', this.id);
  }

  async onEdit() {
    const modal = await this.modalController.create({
    component: EstablishmentFormComponent,
    componentProps: { id: this.id }
    });
    await modal.present();
  }

  onClose() {
    this.modalController.dismiss();
  }

}
