import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toastController: ToastController,
  ) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      color: 'dark',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async presentToastError(message) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async presentToastSuccess(message) {
    const toast = await this.toastController.create({
      message,
      color: 'success',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
