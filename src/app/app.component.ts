import { PrintService } from './services/print.service';
import { UploadService } from 'src/app/services';
import { Component } from '@angular/core';
import {
  enableIndexedDbPersistence,
  Firestore, updateDoc, collection, doc,
  initializeFirestore, CACHE_SIZE_UNLIMITED
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';
import { AuthService, NetworkService } from './services';
import { AppUpdateService } from './services/app-update.service';
import { FirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private db: Firestore,
    private app: FirebaseApp,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private appUpdateService: AppUpdateService,
    private networkService: NetworkService,
    private uploadService: UploadService,
    public printService: PrintService
  ) {
    // this.clearCacheFolder();
    this.appUpdateService.subscribeUpdate();
    // this.networkService.$networkStatus.subscribe(res => {
    // });
    this.networkService.listen();
    this.networkService.logCurrentNetworkStatus().then(res => {
      if (res && res.connected && res.connectionType === 'wifi') {
      // this.synchronizeImage();
      }
    });

    this.createCacheFolder();
    // initializeFirestore(app, {
    //   cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    // });
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
        }
      });
    authService.getAuthState().subscribe(
      res => {
        if (res) {
          router.navigate(['app/establishments']);
        }
      }
    );
  }

  async synchronizeImage() {
    const res = await Filesystem.readdir({
      directory: Directory.Cache,
      path: 'CACHED-IMG'
    });
    console.log(res.files.length);
    const images = res.files.filter(file => file.name.charAt(file.name.length - 1) === 'l');
    console.log('synchronization des images');
    if (images.length) {
      const loading = await this.loadingController.create({
        message: 'Synchronization des images 0/' + images.length,
        duration: 5000,
        spinner: 'bubbles'
      });
      await loading.present();
      images.forEach(async (image, i) => {
        loading.message = 'Synchronization des images ' + (i + 1) + '/' + images.length;
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

        }
      });
    }

  }

  private async createCacheFolder() {
    try {
      await Filesystem.mkdir({
        directory: Directory.Cache,
        path: 'CACHED-IMG'
      });
    } catch (e) {
      console.log(e.message);
    }

  }

  private async clearCacheFolder() {
    await Filesystem.rmdir({
      directory: Directory.Cache,
      path: 'CACHED-IMG'
    });
  }
}
