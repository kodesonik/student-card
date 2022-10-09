/* eslint-disable curly */
import { AlertService } from './../../services/alert.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  displayPassword = false;
  email: string;
  password: string;

  constructor(
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  async onLogin() {
    if(!this.email) return this.alertService.presentToastError('Email manquant!');
    if(!this.password) return this.alertService.presentToastError('Mot de passe manquant!');

    const loading = await this.loadingController.create({
      message: 'Connexion...',
      duration: 20000,
      spinner: 'bubbles'
    });
    await loading.present();
    try {
      await this.authService.login(this.email, this.password);
      loading.dismiss();
    }catch (err) {
      console.log(err);
      loading.dismiss();
      this.alertService.presentToastError(err.message)
    }
  }


}
