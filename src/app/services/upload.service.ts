import { Injectable } from '@angular/core';
import { Url } from 'url';
import { uploadString, ref, getStorage, getDownloadURL, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }


  async post(path: string, file): Promise<string | Url> {
    const fileRef = ref(getStorage(), path + new Date().getTime());

    // and kicks off the upload
    const task = await uploadString(fileRef, file, 'data_url');
    return getDownloadURL(task.ref);
  }

  async postFile(path: string, file): Promise<string | Url> {
    const storage = getStorage();
    const storageRef = ref(storage, path + new Date().getTime());

    // and kicks off the upload
    const task = await uploadBytes(storageRef, file);
    return getDownloadURL(task.ref);
  }
}
