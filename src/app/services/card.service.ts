import { LynadaComponent } from './../shared/cards/lynada/lynada.component';
import { DefaultComponent } from './../shared/cards/default/default.component';
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { BehaviorSubject } from 'rxjs';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Card } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private _cards: Card[] = [];
  private _$cards = new BehaviorSubject<Card[]>([]);
  private _themes = [
    {
      name: 'default',
      component: DefaultComponent
    },
    {
      name: 'lynada',
      component: LynadaComponent
    },
  ];


  constructor() { }

  addCard(card: Card) {
    this._cards.find(c => c.id === card.id) ? null : this._cards.push(card);
    this._$cards.next(this._cards);
  }

  get themes() {
    return this._themes;
  }

  getThemeComponent(name = 'default') {
    return this._themes.find(theme => theme.name === name)?.component;
  }

  removeCard(id: string) {
    this._cards = this._cards.filter(c => c.id !== id);
    this._$cards.next(this._cards);
  }

  get $cards() {
    return this._$cards.asObservable();
  }

}
