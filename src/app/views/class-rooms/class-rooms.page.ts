/* eslint-disable curly */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClassRoom, Establishment } from 'src/app/models';
import { ClassRoomService, EstablishmentService } from 'src/app/services';
import { ClassRoomFormComponent } from 'src/app/shared/forms/class-room-form/class-room-form.component';

@Component({
  selector: 'app-class-rooms',
  templateUrl: './class-rooms.page.html',
  styleUrls: ['./class-rooms.page.scss'],
})
export class ClassRoomsPage implements OnInit, OnDestroy {

  classRooms: ClassRoom[] = [];
  establishment: Establishment;
  schoolYearId: string;
  routeSub: Subscription;
  dataSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private classRoomService: ClassRoomService,
    private establishmentService: EstablishmentService
  ) { }

  ngOnInit() {
    this.classRoomService.clearData();
    this.dataSub = this.classRoomService.$data.subscribe(res => this.classRooms = res);
    // this.route
    this.routeSub = this.route.params.subscribe(params => {
      this.schoolYearId = params['schoolYearId'];
      this.establishment = this.establishmentService.getByParam('id', params['establishmentId']);
      this.classRoomService.load(params['establishmentId'], this.schoolYearId);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.dataSub.unsubscribe();
  }

  async onAdd() {
    const modal = await this.modalController.create({
      component: ClassRoomFormComponent,
    });

    await modal.present();
  }

}
