/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
import { getApp } from '@firebase/app';
import {
  getFirestore,
  onSnapshot,
  collection,
  CollectionReference,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  query,
  orderBy,
  getDocs
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Establishment } from '../models';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  private firestore;
  private dataCollection: CollectionReference;

  private collectionName = 'establishments';
  private _data = new BehaviorSubject<Establishment[]>([]);

  constructor(
    private loadingController: LoadingController
  ) {
    this.firestore = getFirestore(getApp());
    this.dataCollection = collection(this.firestore, this.collectionName);
    this.load();
  }

  get $data() {
    return this._data.asObservable();
  }

  getByParam(param: string, value: any) {
    return this._data.value.find(est => est[param] === value);
  }

  async add(data: Establishment) {
    data.createdAt = serverTimestamp();
    return await addDoc(this.dataCollection, data);
  }

  async edit(req: Establishment) {
    const { id, ...data } = req;
    return await updateDoc(doc(this.firestore, this.collectionName, id), data as any);
  }

  async delete(id) {
    return await deleteDoc(doc(this.firestore, this.collectionName, id));
  }

  private async  load() {
  const loading = await this.loadingController.create({
    message: 'Chargement des donnees',
    duration: 15000,
    spinner: 'bubbles'
  });
  await loading.present();
    const q = query(this.dataCollection, orderBy('name'));
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

  private listen() {
    const q = query(this.dataCollection, orderBy('name'));
    onSnapshot(q, snapshot => {
      this._data.next(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));
    });
  }
}
