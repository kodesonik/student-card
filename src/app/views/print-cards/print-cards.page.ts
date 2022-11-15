import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Card } from 'src/app/models';
import { CardService, EstablishmentService, PrintService } from 'src/app/services';

@Component({
  selector: 'app-print-cards',
  templateUrl: './print-cards.page.html',
  styleUrls: ['./print-cards.page.scss'],
})
export class PrintCardsPage implements OnInit {
  cardsPages: Card[][] = [];
  isPrinting = false;

  constructor(
    private location: Location,
    private cardService: CardService,
    private printService: PrintService,
  ) { }

  ngOnInit() {
    // console.log('printing cards');
    this.cardService.$cards.pipe(take(1)).toPromise().then(res => {
      this.cardsPages = [];
      for(let i = 0; i < res.length; i+=8){
        this.cardsPages.push(res.slice(i, i+8));
      }
      console.log(this.cardsPages);
      this.printService.onDataReady();
    });
  }

  onBack() {
    this.location.back();
  }
}
