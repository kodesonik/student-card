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
  serverTimestamp,
  getDocs,
  where,
  query
} from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
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

  async load(establishmentId: string, schoolYearId: string) {
    this._data.next([]);
    this._establishmentId = establishmentId;
    this._schoolYearId = schoolYearId;
    this.dataCollection = collection(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName);
    const loading = await this.loadingController.create({
      message: 'Chargement des donnees',
      duration: 15000,
      spinner: 'bubbles'
    });
    await loading.present();
    getDocs(this.dataCollection).then(res => {
      loading.dismiss();
      if (res.size) this._data.next(res.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));
      this.listen();
    }).catch(err => {
      loading.dismiss();
      console.log(err);
      this.listen();
    });
  }

  getByParam(param: string, value: any) {
    return this._data.value.find(classRoom => classRoom[param] === value);
  }

  async add(data: ClassRoom) {
    data.createdAt = serverTimestamp();
    return await addDoc(this.dataCollection, data);
  }

  async findOrAdd(data: ClassRoom) {
    const q = query(
      this.dataCollection,
      where('level', '==', data.level),
      where('serie', '==', data.serie),
      where('num', '==', data.num)
    );
    const { size, docs } = await getDocs(q);
    if (size) return docs[0].id;
    data.createdAt = serverTimestamp();
    const { id } = await addDoc(this.dataCollection, data);
    return id;
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
    await deleteDoc(docReference);
    const dataCollection = collection(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      'students');
    const q = query(this.dataCollection,
      where('classRoomId', '==', id)
    );
    return await getDocs(q).then(res => {
      res.forEach(doc => deleteDoc(doc.ref));
    });
  }


  private listen() {
    this.dataCollection = collection(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName);
    onSnapshot(this.dataCollection, snapshot => {
      this._data.next(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));
    });
  }

}
