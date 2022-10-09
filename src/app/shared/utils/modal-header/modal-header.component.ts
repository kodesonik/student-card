import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() optional: string;
  @Input() noReturn: boolean;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }


  onBack() {
    this.modalController.dismiss();
  }

}
