import { CropImageComponent } from './../shared/utils/crop-image/crop-image.component';
/* eslint-disable curly */
import { Injectable, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { LoadingController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(
    private modalController: ModalController,
  ) { }

  async takePicture(onlyCam?: boolean) {
    try {
      await Camera.requestPermissions();
    } catch (err) {
      console.log(err.message);
    } finally {
      const params: ImageOptions = {
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        width: 500,
        height: 500
      };

      if (onlyCam) {params.source = CameraSource.Camera;}
      const image = await Camera.getPhoto(params);

      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    //  if (image) {
    //    return await this.cropImage(image.dataUrl);
    //  }
    //  else return;
      // eslint-disable-next-line no-unsafe-finally
      return  image?.dataUrl;
      // Can be set to the src of an image now
    }
  };

  async cropImage( myImage) {
    const modal = await this.modalController.create({
    component: CropImageComponent,
    componentProps: { myImage }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    console.log(data);
    return data;
  }

}
