import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor() { }


  listen() {
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
    });
  }

  async logCurrentNetworkStatus() {
    const status = await Network.getStatus();
    console.log('Network status:', status);
  };
}
