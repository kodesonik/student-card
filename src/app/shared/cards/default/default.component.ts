/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/models';
import { Sex } from 'src/app/types';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {

  @Input() data: Card;
  SEX = Sex;

  constructor() { }

  ngOnInit() {}


}
