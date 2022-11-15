/* eslint-disable curly */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() data: Card;
  @Input() theme: string;

  constructor() { }

  ngOnInit() {
    if (this.theme) this.data.theme = this.theme;
    console.log(this.data.theme);
  }

}
