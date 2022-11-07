import { Observable } from 'rxjs';
/* eslint-disable no-underscore-dangle */
/* eslint-disable curly */
import { NetworkService } from './network.service';
import { Injectable } from '@angular/core';
// import { Url } from 'url';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { uploadString, ref, getStorage, getDownloadURL, uploadBytes } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
const CACHE_FOLDER = 'CACHED-IMG';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private _offlineDataCount = new BehaviorSubject<number>(0);
  constructor(
    private networkService: NetworkService
  ) { 
    this.countCachedFiles().then(count => this._offlineDataCount.next(count));
  }

  get $offlineDataCount(): Observable<number> {
    return this._offlineDataCount.asObservable();
  }

  async post(path: string, file, meta?: string[]): Promise<any> {
    console.log('post avatar');
    if (meta) {
      const connectionStatus = await this.networkService.logCurrentNetworkStatus();
      if (!(connectionStatus.connected && connectionStatus.connectionType === 'wifi')){
        const url = this.saveOnDisk(path, file, meta);
        const count = this._offlineDataCount.value + 1;
        this._offlineDataCount.next(count);
        return url;
      }
    };
    const fileRef = ref(getStorage(), path + new Date().getTime());
    // and kicks off the upload
    const task = await uploadString(fileRef, file, 'data_url');
    return getDownloadURL(task.ref);
  }

  async postFile(path: string, file, meta?: string[]): Promise<any> {
    const connectionStatus = await this.networkService.logCurrentNetworkStatus();
    if (connectionStatus.connected && connectionStatus.connectionType === 'wifi') {
      const storage = getStorage();
      const storageRef = ref(storage, path + new Date().getTime());

      // and kicks off the upload
      const task = await uploadBytes(storageRef, file);
      return getDownloadURL(task.ref);
    }
    if (!meta) return;
    const data = await this.convertBlobToBase64(file);
    return this.saveOnDisk(path, data, meta);
  }

  async saveOnDisk(path: string, file, meta: string[]) {
    console.log('save on disk');
    const imageName = meta[0] + '-'+ meta[1] + '-' + meta[2]+ '-' + new Date().getTime().toString()+ 'l';
    console.log('imageName', imageName);
    await this.storeImage(file,imageName);
    const fullPath =  path + '%' + imageName + '?local=true';
    return fullPath;
  }

  async storeImage(data, path) {
    // const response = await fetch(url);
    // // console.log(response)
    // const blob = await response.blob();

    const base64 = data.split(',').pop();

    const savedFile = await Filesystem.writeFile({
      data: base64,
      path: `${CACHE_FOLDER}/${path}`,
      directory: Directory.Cache,
    });
    return savedFile;
  }

  // helper function
  convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  async countCachedFiles() {
    const { files } = await Filesystem.readdir({
      directory: Directory.Cache,
      path: 'CACHED-IMG'
    });
    return files.filter(file => file.name.charAt(file.name.length - 1) === 'l').length;
  }
}
