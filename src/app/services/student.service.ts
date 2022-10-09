/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { getApp } from '@angular/fire/app';
import {
  CollectionReference,
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
  orderBy,
  serverTimestamp
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private firestore;
  private dataCollection: CollectionReference;

  private collectionName = 'students';
  private _data = new BehaviorSubject<Student[]>([]);
  private _establishmentId: string;
  private _schoolYearId: string;
  private _classRoomId: string;
  constructor() {
    this.firestore = getFirestore(getApp());
  }

  get $data() {
    return this._data.asObservable();
  }

  load(establishmentId: string, schoolYearId: string, classRoomId?: string) {
    this._establishmentId = establishmentId;
    this._schoolYearId = schoolYearId;
    this._classRoomId = classRoomId;
    this.dataCollection = collection(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName);
    let q = query(this.dataCollection, orderBy('lastName'), orderBy('firstName'));
    if (this._classRoomId) {
      q = query(this.dataCollection,
        where('classRoomId', '==', this._classRoomId),
        // orderBy('lastName'),
        // orderBy('firstName')
        );
    }
    onSnapshot(q, snapshot => {
      console.log('response', snapshot.size);
      this._data.next(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));
    });
  }

  getByParam(param: string, value: any) {
    return this._data.value.find(est => est[param] === value);
  }

  async add(req: Student) {
    const { id, ...data } = req;
    data.createdAt = serverTimestamp();
    if (this._classRoomId) data.classRoomId = this._classRoomId;
    const docReference = doc(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName, id);
    return await setDoc(docReference, data);
  }

  async edit(req: Student) {
    const { id, ...data } = req;
    const docReference = doc(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName, id);
    return await updateDoc(docReference, data as any);
  }

  async delete(id) {
    const docReference = doc(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName, id);
    return await deleteDoc(docReference);
  }

}
