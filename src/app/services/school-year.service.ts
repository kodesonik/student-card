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
  orderBy,
  getDocs
} from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
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

  constructor(
    private loadingController: LoadingController
  ) {
    this.firestore = getFirestore(getApp());
  }

  get $data() {
    return this._data.asObservable();
  }

  clearData() {
    this._data.next([]);
  }

  async load(establishmentId) {
    this._data.next([]);
    this._establishmentId = establishmentId;
    this.dataCollection = collection(this.firestore, 'establishments', this._establishmentId, this.collectionName);
    const q = query(this.dataCollection, orderBy('start', 'desc'));
    const loading = await this.loadingController.create({
      message: 'Chargement des donnees',
      duration: 15000,
      spinner: 'bubbles'
    });
    await loading.present();
    getDocs(q).then(res => {
      loading.dismiss();
    if (res.size)  this._data.next(res.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));
      this.listen();
    }).catch(err => {
      loading.dismiss();
      console.log(err);
      this.listen();
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


  private listen() {
    const q = query(this.dataCollection, orderBy('start', 'desc'));
    onSnapshot(q, snapshot => {
      const schoolYears = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      this._data.next(schoolYears);
    });
  }
}
