/* eslint-disable quote-props */
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting = false;
  constructor(
    private router: Router,
    private location: Location
    // @Inject(DOCUMENT) private document: HTMLDocument
  ) { }

  // init() {
  //   window.onbeforeprint = () => this.setPrintStyles(true);
  //   window.onafterprint = () => this.setPrintStyles(false);
  // }


  printCards() {
    this.isPrinting = true;
    this.router.navigate(['/',
      {
        outlets: {
          'print': ['print', 'cards']
        }
      }]);
  }

  printDocument(documentName: string, documentData: string[]) {
    this.isPrinting = true;
    this.router.navigate(['/',
      {
        outlets: {
          'print': ['print', documentName, documentData.join()]
        }
      }]);
  }

  onDataReady() {
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.onBack();
    }, 4000);
  }

  onBack() {
    this.location.back();
  }

  // private setPrintStyles(add: boolean) {
  //   this.document.querySelectorAll('ion-content').forEach((element) => {
  //     const scroll = element.shadowRoot.querySelector('.inner-scroll') as HTMLElement;
  //     if (add) {
  //       scroll.style.position = 'relative';
  //     } else {
  //       scroll.style.removeProperty('position');
  //     }
  //   });
  // }
}
