/* eslint-disable curly */
// import { Url } from 'url';
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
// import { DisplayImageComponent } from './../../../../modals/display-image/display-image.component';
import { Component, Input, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';
const CACHE_FOLDER = 'CACHED-IMG';

@Component({
  selector: 'app-cache-img',
  templateUrl: './cache-img.component.html',
  styleUrls: ['./cache-img.component.scss'],
})
export class CacheImgComponent implements OnInit {
  _src: string = '';
  @Input() spinner = false;
  @Input() cssClasses: string;
  @Input() displayImage: boolean;
  @Input() download: boolean;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }


  isLocalPic(src) {
    return !src.startsWith('http');
  }

  @Input()
  set src(imageUrl: any) {
    // console.log('SET SOURCE', imageUrl);
    // this._src = imageUrl;
    if (!imageUrl) this._src = '';
    // else if(this.isLocalPic(imageUrl)) this._src = imageUrl;
    else {
      let imageName = imageUrl.split('%').pop();
      imageName = imageName.split('?').shift();
      // console.log('IMAGE NAME', imageName);
      Filesystem.readFile({
        directory: Directory.Cache,
        path: `${CACHE_FOLDER}/${imageName}`
      }).then(({ data }) => {
        // console.log('CACHED IMAGE', data);
        this._src = `data:image/png;base64,${data}`;
      }).catch(async e => {
        // Write file to cache
        // console.log(e.message);
        await this.storeImage(imageUrl, imageName);
        Filesystem.readFile({
          directory: Directory.Cache,
          path: `${CACHE_FOLDER}/${imageName}`
        }).then(({ data }) => {
          // console.log('CACHED IMAGE', data);
          if (data) this._src = `data:image/png;base64,${data}`;
          else this._src = 'assets/img/avatar.png';
        });
      });
    }
  }

  async storeImage(url, path) {
    try {
      const response = await fetch(url);
      // console.log(response)
      const blob = await response.blob();

      const base64 = await this.convertBlobToBase64(blob) as string;

      const savedFile = await Filesystem.writeFile({
        data: base64,
        path: `${CACHE_FOLDER}/${path}`,
        directory: Directory.Cache,
      });
      return savedFile;
    } catch (err) {
      console.log(err);
      return;
    }

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

  onClick(ev) {
    console.log('display');
    if (this.displayImage) {
      ev.stopPropagation();
      this.onDisplayImage();
    } else if (this.download) {
      ev.stopPropagation();
      this.dowmloadImage();
    }
  }

  async onDisplayImage() {
    // const modal = await this.modalController.create({
    // component: DisplayImageComponent,
    // componentProps: { url: this._src }
    // });

    // await modal.present();

  }


  async dowmloadImage() {

  }

}
