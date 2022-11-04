/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConnectionStatus, Network,  } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private _$networkStatus = new BehaviorSubject<ConnectionStatus>(null);
  constructor() {
    // this.listen();
   }


  listen() {
    Network.addListener('networkStatusChange', status => {
      // console.log('Network status changed', status);
      this._$networkStatus.next(status);
    });
  }

  get $networkStatus() {
    return this._$networkStatus.asObservable();
  }

  
  async logCurrentNetworkStatus() {
    const status = await Network.getStatus();
    this._$networkStatus.next(status);
    return status;
    // console.log('Network status:', status);
  };
}
