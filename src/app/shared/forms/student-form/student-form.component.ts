/* eslint-disable curly */
import { PhotoService } from './../../../services/photo.service';
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Student } from 'src/app/models';
import { AlertService, StudentService, UploadService } from 'src/app/services';
import { Sex } from 'src/app/types';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {

  @Input() id: string;

  avatar;

  data: Student = {
    id: '',
    classRoomId: null,
    avatar: null,
    firstName: '',
    lastName: '',
    nationality: '',
    phoneNumber: '',
    sex: null,
    birthDate: '',
    birthPlace: '',
  };

  SEX = Sex;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private studentService: StudentService,
    private photoService: PhotoService,
    private uploadService: UploadService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.id) this.data = this.studentService.getByParam('id', this.id);
  }

  async onTakePhoto() {
    this.avatar =  await this.photoService.takePicture();
    // this.data.avatar = this.avatar;
  }


  async onValidate() {
    const loading = await this.loadingController.create({
      message: 'Ajout de l\'etablissement...',
      duration: 30000,
      spinner: 'bubbles'
    });
    await loading.present();
    // upload logo
    if(this.avatar) {
      loading.message = 'Upload du avatar  en cours ...';
      try {
        this.data.avatar = await this.uploadService.post('avatar/', this.avatar);
      } catch(err) {
        console.log(err.message);
        this.alertService.presentToastError('Eche de l\'upload du avatar!');
      }
    }

    // save data

    await this.studentService.add(this.data);
    loading.dismiss();
    this.alertService.presentToastSuccess('Ajoute avec success!!!');
    this.onClose();
  }

  onClose() {
    this.modalController.dismiss();
  }

}
