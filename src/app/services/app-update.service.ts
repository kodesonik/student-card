import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(
    private readonly updates: SwUpdate,
    private toastController: ToastController
    ) {
   
  }   

  subscribeUpdate() {
    const updatesAvailable = this.updates.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      })));
    updatesAvailable.subscribe(evt => {
      this.showUpdateToast();
    });
  }

  private async showUpdateToast() {
    const toast = await this.toastController.create({
      message: 'Nouvelle version disponible. L\'application va se recharger.',
      position: 'middle',
      color: 'warning',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.updates.activateUpdate().then( () => window.location.reload())
          }
        }
      ]
    });
    toast.present();
  }
}
