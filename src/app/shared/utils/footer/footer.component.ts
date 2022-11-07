/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { AlertController } from '@ionic/angular';
import { NetworkService, UploadService } from 'src/app/services';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  progress = 0;
  // isSync = false;
  isOnline = false;
  imagesLength = 0;
  constructor(
    private db: Firestore,
    private uploadService: UploadService,
    private networkService: NetworkService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.networkService.$networkStatus.subscribe( res => this.isOnline = (res.connected && res.connectionType === 'wifi')?true:false);
    this.uploadService.$offlineDataCount.subscribe( res => this.imagesLength = res);
    this.networkService.logCurrentNetworkStatus().then( res => this.isOnline = res.connected ?true:false);
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Voulez vous  <strong>uploader</strong> les images?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Synchroniser',
          handler: () => {
           this.synchronizeImage();
          }
        }
      ]
    });
    await alert.present();
  }

  async synchronizeImage() {
    const { count, files} = await this.getCachedFiles();
    if (count) {
      // this.isSync = true;
      this.imagesLength = count;
      files.forEach(async (image, i) => {
        this.progress = i/this.imagesLength;
        console.log(image.name);
        const parts = image.name.split('-');
        if (parts.length > 3) {
          const establishmentId = parts[0];
          // let reminder =  image.name.split('-')[1];
          const schoolYearId = parts[1];
          // reminder = reminder.split('-').shift();
          const studentId = parts[2];
          // reminder = reminder.split('-').shift();
          const path = 'avatar/';
          console.log(establishmentId, schoolYearId, studentId, path);
          Filesystem.readFile({
            directory: Directory.Cache,
            path: 'CACHED-IMG/'+image.name
          }).then(async ({ data }) => {
            // console.log('CACHED IMAGE', data);
            const src = `data:image/png;base64,${data}`;
            const avatar = await this.uploadService.post(path, src);
            console.log(avatar);
            await updateDoc(
              doc(this.db, 'establishments', establishmentId, 'school-years', schoolYearId, 'students', studentId),
              { avatar }
            );
            Filesystem.deleteFile({
              directory: Directory.Cache,
              path: 'CACHED-IMG/'+image.name
            });
          });
          const { count } = await this.getCachedFiles();
          this.imagesLength = count;
        }
      });
      // this.isSync = false;
    }

  }

  async getCachedFiles() {
    const { files } = await Filesystem.readdir({
      directory: Directory.Cache,
      path: 'CACHED-IMG'
    });
    return { count: files.filter(file => file.name.charAt(file.name.length - 1) === 'l').length, files};
  }

}
