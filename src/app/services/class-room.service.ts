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
  serverTimestamp
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { ClassRoom } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClassRoomService {

  private firestore;
  private dataCollection: CollectionReference;

  private collectionName = 'classrooms';
  private _data = new BehaviorSubject<ClassRoom[]>([]);
  private _establishmentId: string;
  private _schoolYearId: string;

  constructor() {
    this.firestore = getFirestore(getApp());
  }

  get $data() {
    return this._data.asObservable();
  }

  clearData() {
    this._data.next([]);
  }

  load(establishmentId: string, schoolYearId: string) {
    this._establishmentId = establishmentId;
    this._schoolYearId = schoolYearId;
    this.dataCollection = collection(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName);
    onSnapshot(this.dataCollection, snapshot => {
      this._data.next(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));
    });
  }

  getByParam(param: string, value: any) {
    return this._data.value.find(classRoom => classRoom[param] === value);
  }

  async add(data: ClassRoom) {
    data.createdAt = serverTimestamp();
    return await addDoc(this.dataCollection, data);
  }

  async edit(req: ClassRoom) {
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
