import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CardService } from 'src/app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() optional: string;
  @Input() noReturn: boolean;
  @Output() searchValue = new EventEmitter();
  cardsLength: number;

  constructor(
    private location: Location,
    private router: Router,
    private cardService: CardService,
    ) { }

  ngOnInit() {
    this.cardService.$cards.subscribe( cards => this.cardsLength = cards.length);
  }

  onSearchChange(ev) {
    console.log(ev.target.value);
    this.searchValue.emit(ev.target.value);
  }

  onBack() {
    this.location.back();
  }

  onPrint() {
    this.router.navigate(['/print-cards']);
  }

}
