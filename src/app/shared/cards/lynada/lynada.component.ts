/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/models';
import { Sex } from 'src/app/types';

@Component({
  selector: 'app-lynada',
  templateUrl: './lynada.component.html',
  styleUrls: ['./lynada.component.scss'],
})
export class LynadaComponent implements OnInit {

  @Input() data: Card;
  SEX = Sex;
  constructor() { }

  ngOnInit() {}

}
