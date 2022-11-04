/* eslint-disable curly */
import { NetworkService } from './network.service';
import { Injectable } from '@angular/core';
// import { Url } from 'url';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { uploadString, ref, getStorage, getDownloadURL, uploadBytes } from '@angular/fire/storage';
const CACHE_FOLDER = 'CACHED-IMG';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private networkService: NetworkService
  ) { }


  async post(path: string, file, meta?: string[]): Promise<any> {
    console.log('post avatar');
    if (meta) {
      const connectionStatus = await this.networkService.logCurrentNetworkStatus();
      if (!(connectionStatus.connected && connectionStatus.connectionType === 'wifi')){
        return this.saveOnDisk(path, file, meta);
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
}
