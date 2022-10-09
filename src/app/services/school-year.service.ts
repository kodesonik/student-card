/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { getApp } from '@angular/fire/app';
import {
  CollectionReference,
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { SchoolYear } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SchoolYearService {

  private firestore;
  private dataCollection: CollectionReference;

  private collectionName = 'school-years';
  private _data = new BehaviorSubject<SchoolYear[]>([]);
  private _establishmentId: string;

  constructor() {
    this.firestore = getFirestore(getApp());
  }

  get $data() {
    return this._data.asObservable();
  }

  clearData() {
    this._data.next([]);
  }

  load(establishmentId: string) {
    this._establishmentId = establishmentId;
    this.dataCollection = collection(this.firestore, 'establishments', this._establishmentId, this.collectionName);
    const q = query(this.dataCollection, orderBy('start', 'desc'));
    onSnapshot(q, snapshot => {
      const schoolYears = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      this._data.next(schoolYears);
    });
  }

  getByParam(param: string, value: any) {
    return this._data.value.find(est => est[param] === value);
  }

  async add(data: SchoolYear) {
    data.createdAt = serverTimestamp();
    const collectionReference  = collection(this.firestore, 'establishments', this._establishmentId, this.collectionName);
    return await addDoc(collectionReference, data);
  }

  async edit(req: SchoolYear) {
    const { id, ...data } = req;
    const docReference  = doc(this.firestore, 'establishments', this._establishmentId, this.collectionName, id);
    return await updateDoc(docReference, data as any);
  }

  async delete(id) {
    const docReference  = doc(this.firestore, 'establishments', this._establishmentId, this.collectionName, id);
    return await deleteDoc(docReference);
  }

}
