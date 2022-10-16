import { StudentFormComponent } from 'src/app/shared/forms/student-form/student-form.component';
import { Component, Input, OnInit } from '@angular/core';
import { Student } from 'src/app/models';
import { StudentService } from 'src/app/services';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-student-infos',
  templateUrl: './student-infos.component.html',
  styleUrls: ['./student-infos.component.scss'],
})
export class StudentInfosComponent implements OnInit {

  @Input() id: string;

  data: Student;
  manager: any;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private studentService: StudentService
  ) { }

  ngOnInit() {
    this.data = this.studentService.getByParam('id', this.id);
  }

  async onEdit() {
    const modal = await this.modalController.create({
    component: StudentFormComponent,
    componentProps: { id: this.id }
    });
    await modal.present();
  }

  onClose() {
    this.modalController.dismiss();
  }

}
