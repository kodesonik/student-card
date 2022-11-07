import { map } from 'rxjs/operators';
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { read, writeFileXLSX, utils } from 'xlsx';
import { ClassRoomService, StudentService } from '.';
import { ClassRoom, Student } from '../models';
import { Level, Serie } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SeedService {

  _params = { num: 'N°', firstName: 'NOMS', lastName: 'PRENOMS', sex: 'SEXE', id: 'N°MLE' };
  _errorLogs: string[] = [];
  _warningLogs: string[] = [];
  _statLogs: string[] = [];

  constructor(
    private loadingController: LoadingController,
    private classroomService: ClassRoomService,
    private studentService: StudentService
  ) { }

  set params(data) {
    this._params = data;
  }

  get params() {
    return this._params;
  }

  get errorLogs() {
    return this._errorLogs;
  }

  get warningLogs() {
    return this._warningLogs;
  }

  async seedClassrooms(file: File) {
    const loading = await this.loadingController.create({
      message: 'Hellooo',
      duration: 20000,
      spinner: 'bubbles'
    });
    await loading.present();
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    const result = [];
    fileReader.onload = (event: any) => {
      const data = event.target.result;
      const workbook = read(data, { type: 'binary' });
      // console.log(workbook);
      workbook.SheetNames.forEach(async (sheet, i) => {
        // console.log(sheet, i);
        if (sheet.length !== 3) return;
        const tableRow: { classroom: ClassRoom; students: Student[] } = { classroom: null, students: [] };
        tableRow.classroom = await this.formatClass(sheet, null);
        const rowObject = utils.sheet_to_json(workbook.Sheets[sheet]);
        // const secondRow: any = rowObject[1];
        // const header = Object.keys(secondRow).map(key => key);
        // const body = rowObject.slice(1, rowObject.length);
        // console.log(header)
        console.log(rowObject[0][this._params.id]);
        return;
        if (rowObject[0][this._params.id])
          rowObject.forEach(row => {
            const student = this.formatStudent(row, tableRow.classroom.id);
            student ? tableRow.students.push(student) : null;
          });
        result.push(tableRow);
      });
      // find doubloons
      const students = this.buildStudentList(result);
      // display error and warning length

      // save students
      students.forEach(async student => {
        await this.studentService.findOrAdd(student);
      }); loading.dismiss();
    };
  }

  async seedClassroom(file: File, classroomId?: string) {
    const loading = await this.loadingController.create({
      message: 'Upload des donnees',
      duration: 20000,
      spinner: 'bubbles'
    });
    await loading.present();
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = async (event: any) => {
      const tableRow: { classroom: ClassRoom; students: Student[] } = { classroom: null, students: [] };
      const data = event.target.result;
      const workbook = read(data, { type: 'binary' });
      // console.log(workbook);
      const sheet = workbook.SheetNames[0];
      // console.log(sheet, i);
      // if (sheet.length !== 3) return;
      const classroom = await this.formatClass(sheet, classroomId);
      tableRow.classroom = classroom;
      let rowObject = utils.sheet_to_json(workbook.Sheets[sheet]);
      // console.log(rowObject);
      // console.log(rowObject[0][this._params.id]);
      if (!rowObject[0][this._params.id]) {
        const header: any = rowObject[0];
        // const header = Object.keys(secondRow).map(key => key);
        rowObject = rowObject.slice(1, rowObject.length);
        const formatedRowObjet = [];
        rowObject.map((item: any) => {
          const formatedItem: any = {};
          Object.keys(item).map(key => formatedItem[header[key]] = item[key]);
          formatedRowObjet.push(formatedItem);
          return formatedItem;
        });
        // console.log(header);
        // console.log(formatedRowObjet);
        rowObject = formatedRowObjet;
      }

      // console.log(header)
      rowObject.forEach(row => {
        const student = this.formatStudent(row, classroomId);
        student ? tableRow.students.push(student) : null;
      });
      console.log('result', tableRow);
      // find doubloons
      const students = this.buildStudentList([tableRow]);
      console.log(students);
      // display error and warning length

      // save students
      students.forEach(async (student, i) => {
        loading.message = 'Enregistrement des eleves ' + (i + 1) + '/' + students.length;
        await this.studentService.findOrAdd(student);
      });
      loading.dismiss();
    };
  }

  private async formatClass(name: string, classRoomId: string) {
    const classroom: ClassRoom = {
      id: classRoomId,
      level: name.charAt(0) as Level,
      serie: name.charAt(1) as Serie,
      num: name.charAt(2) || null
    };
    if (!classroom.id) classroom.id = await this.classroomService.findOrAdd(classroom);
    return classroom;
  }

  private formatStudent(row: any, classRoomId: string) {
    // console.log(row[this._params.id]);
    const student: Student = {
      // num: row[header[0]],
      id: row[this._params.id],
      firstName: row[this._params.firstName],
      lastName: row[this._params.lastName],
      sex: row[this._params.sex]?.charAt(0),
      //
      classRoomId,
      avatar: null,
      birthDate: null,
      birthPlace: null,
      phoneNumber: null,
      nationality: 'Togolaise'
    };
    if (this.findIssues(row, student)) return;
    return student;
  }

  private buildStudentList(data) {
    let students: Student[] = [];
    const duplicateStudents: Student[] = [];
    data.forEach(item => {
      const formatedStudents = item.students.map(
        student => ({ ...student, classroom: item.classroom.level + item.classroom.serie + item.classroom.num }));
      students = students.concat(formatedStudents);
    });
    console.log('----> Effectif total', students.length);
    const lastId = students.sort(this.compare)[students.length - 3];
    console.log(' ---> Dernier Mlle ', lastId);
    students.forEach(student => {
      const sameIds = students.filter(elem => elem.id === student.id);
      if (sameIds.length > 1) {
        duplicateStudents.push(student);
        // console.log(' ----> Double account id for ' + student.id , student.firstName, student.lastName)
      }
    });
    console.log(' ---> Doublons', duplicateStudents.length);
    duplicateStudents.sort(this.compare);
    return students;
    // this.exportDuplicateId()
  }

  resolveDuplicateId(students: Student[], maxId: number = 10000) {
    for (let i = 0; i < students.length; i++) {
      const sameIds = students.filter(elem => elem.id === students[i].id);
      if (sameIds.length > 1) {
        maxId++;
        students[i].id = maxId.toString();
      }
    }
    students.sort(this.compare);

    // this.students.sort(this.compare)
    // console.log(' --> longueur de donnees corrgee', this.students.length)
    // this.exportResolution()
  }

  private compare(a: Student, b: Student) {
    return Number(a.id) > Number(b.id) ? 1 : -1;
  }

  private findIssues(row, student: Student) {
    // if (!student.num) console.log('No num for ' + header[1] + ' ' + student.firstName)
    if (!student.id) console.log('No' + this.params.id + ' for ' + student.firstName + ' ' + student.lastName);
    // if (student.id.toString().length !== 5) {
    //   console.log('Id length not 5 ' + this.params.lastName + ' ' + student.firstName);
    //   this.duplicateStudents.push(student);
    // }
    //  if (!student.firstName) console.log('No firstName for ' + this.params.firstName + ' ' + student.num)
    //  if (!student.lastName) console.log('No num lastName ' + header[1] + ' ' + student.num)
    //  if (!student.sex) console.log('No sex for ' + header[1] + ' ' + student.num)
    //  if (student.sex) student.sex = student.sex.charAt(0)
    return false;
  }

}
