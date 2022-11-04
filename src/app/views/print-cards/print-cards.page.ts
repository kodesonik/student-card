import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/models';
import { CardService } from 'src/app/services';

@Component({
  selector: 'app-print-cards',
  templateUrl: './print-cards.page.html',
  styleUrls: ['./print-cards.page.scss'],
})
export class PrintCardsPage implements OnInit {
  cards: Card[] = [];
  constructor(
    private location: Location,
    private cardService: CardService,
  ) { }

  ngOnInit() {
    this.cardService.$cards.subscribe(res => this.cards = res);
  }

  onPrint() {
    window.print();
  }


  onBack() {
    this.location.back();
  }
}
