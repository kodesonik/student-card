import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ImageCropperComponent, ImageTransform, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss'],
})
export class CropImageComponent implements OnInit {
  @Input() myImage: any = null;
  @ViewChild('cropper') cropper: ImageCropperComponent;
  croppedImage: any = '';
  transform: ImageTransform = {};
  isMobile = Capacitor.getPlatform() !== 'web';

  constructor(
    private modalController: ModalController
    ) {}

  ngOnInit() {

  }

  // Called when cropper is ready
  imageLoaded() {
    // this.loadingCtrl.dismiss();
  }

  // Called when we finished editing (because autoCrop is set to false)
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.onClose(this.croppedImage);
  }

  // We encountered a problem while loading the image
  loadImageFailed() {
    console.log('Image load failed!');
  }

  // Manually trigger the crop
  cropImage() {
    this.cropper.crop();
    this.myImage = null;
  }

  // Discard all changes
  discardChanges() {
    this.myImage = null;
    this.croppedImage = null;
  }

  // Edit the image
  rotate() {
    const newValue = ((this.transform.rotate ?? 0) + 90) % 360;

    this.transform = {
      ...this.transform,
      rotate: newValue,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  onClose(data?) {
    this.modalController.dismiss(data);
  }


}

