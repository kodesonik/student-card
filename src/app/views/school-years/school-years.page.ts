import { SchoolYearFormComponent } from './../../shared/forms/school-year-form/school-year-form.component';
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable curly */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Establishment, SchoolYear } from 'src/app/models';
import { AlertService, EstablishmentService, SchoolYearService } from 'src/app/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-school-years',
  templateUrl: './school-years.page.html',
  styleUrls: ['./school-years.page.scss'],
})
export class SchoolYearsPage implements OnInit, OnDestroy {

  schoolYears: SchoolYear[] = [];
  establishment: Establishment;
  routeSub: Subscription;
  dataSub: Subscription;

  constructor(
    private modalController: ModalController,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private establishmentService: EstablishmentService,
    private schoolYearService: SchoolYearService,
  ) { }

  ngOnInit() {
    this.schoolYearService.clearData();
    this.dataSub = this.schoolYearService.$data.subscribe(res => this.schoolYears = res);
    this.routeSub = this.route.params.subscribe(params => {
      this.establishment = this.establishmentService.getByParam('id', params['establishmentId']);
      this.schoolYearService.load(this.establishment.id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.dataSub.unsubscribe();
  }

  displayClasses(schoolYearId) {
    if (!schoolYearId) return this.alertService.presentToastError('Choississez d\'abord une annee scolaire!');

    this.router.navigate(['class-rooms', this.establishment.id, schoolYearId]);
  }

  async onAdd() {
    const modal = await this.modalController.create({
      component: SchoolYearFormComponent,
    });

    await modal.present();

  }

  async onEdit(id) {
    const modal = await this.modalController.create({
      component: SchoolYearFormComponent,
      componentProps: { id }
    });

    await modal.present();
  }
}
