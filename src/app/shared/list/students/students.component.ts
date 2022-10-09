import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/models';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {

  @Input() cards: Card[];

  constructor() { }

  ngOnInit() {}

  onPrint() {
    window.print();
  }

}
