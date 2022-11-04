/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Student } from 'src/app/models';
import { AlertService, StudentService, PhotoService } from 'src/app/services';
import { Sex } from 'src/app/types';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {

  @Input() id: string;
  @Input() establishmentId: string;
  @Input() schoolYearId: string;
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
    // private uploadService: UploadService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.id) this.data = this.studentService.getByParam('id', this.id);
    console.log(this.data.avatar);
  }

  async onTakePhoto() {
    this.avatar = await this.photoService.takePicture();
    // this.data.avatar = this.avatar;
  }

  async onCropPhoto() {
    const image = this.avatar ? this.avatar : await this.loadImgData(this.data.avatar);
  if (image)  this.avatar = await this.photoService.cropImage(image);
  else this.alertService.presentToastError('Image a croppe introuvable!');
  }

loadImgData(imageUrl: string) {
  let imageName = imageUrl.split('%').pop();
  imageName = imageName.split('?').shift();
  return Filesystem.readFile({
    directory: Directory.Cache,
    path: `CACHED-IMG/${imageName}`
  }).then(({ data }) =>  `data:image/png;base64,${data}`)
  .catch(async e => {
      console.log(e);
      return;
    });
}

  async onValidate() {
  const loading = await this.loadingController.create({
    message: 'Ajout de l\'eleve...',
    duration: 5000,
    spinner: 'bubbles'
  });
  await loading.present();
  // upload logo
  // if(this.avatar) {
  //   loading.message = 'Upload du avatar  en cours ...';
  //   try {
  //     this.data.avatar = await this.uploadService.post('avatar/',
  //  this.avatar, [this.establishmentId, this.schoolYearId, this.data.id]);
  //   } catch(err) {
  //     console.log(err.message);
  //     this.alertService.presentToastError('Echec de l\'upload du avatar!');
  //   }
  // }

  // save data
  this.data.firstName = this.data.firstName.toUpperCase();
  // this.data.lastName =this.data.lastName
  if (!this.id) this.studentService.add(this.data, this.avatar);
  else this.studentService.edit(this.data, this.avatar);
  loading.dismiss();
  this.alertService.presentToastSuccess('Ajoute avec success!!!');
  this.onClose();
}

onClose() {
  this.modalController.dismiss();
}

}
