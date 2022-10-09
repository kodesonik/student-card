import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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
  constructor(
    private location: Location
    ) { }

  ngOnInit() {}

  onSearchChange(ev) {

  }

  onBack() {
    this.location.back();
  }

}
