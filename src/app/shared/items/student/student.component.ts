import { Student } from 'src/app/models';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {

  @Input() data: Student;
  @Output() checked = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() display = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(

  ) { }

  ngOnInit() {}

   onEdit() {
    this.edit.emit();
  }

  async onDelete() {
    this.delete.emit();
  }

   onDisplayInfos() {
    this.display.emit();
  }

  onChecked(ev) {
   this.checked.emit(this.data.isChecked);
  }
}
