import { AlertService } from 'src/app/services';
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
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
  orderBy,
  serverTimestamp,
  getDoc,
  getDocs
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { UploadService } from '.';
import { Student } from '../models';
import { LoadingController } from '@ionic/angular';

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
  constructor(
    private loadingController: LoadingController,
    private uploadService: UploadService,
    private alertService: AlertService,
  ) {
    this.firestore = getFirestore(getApp());
  }

  get $data() {
    return this._data.asObservable();
  }

  async load(establishmentId: string, schoolYearId: string, classRoomId?: string) {
    this._data.next([]);
    this._establishmentId = establishmentId;
    this._schoolYearId = schoolYearId;
    this._classRoomId = classRoomId;
    this.dataCollection = collection(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName);
    // let q = query(this.dataCollection);
    // if (this._classRoomId) {
     const q = query(this.dataCollection,
        where('classRoomId', '==', this._classRoomId)
      );
    // }
    const loading = await this.loadingController.create({
      message: 'Chargement des donnees',
      duration: 15000,
      spinner: 'bubbles'
    });
    await loading.present();
    getDocs(q).then(res => {
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
    return this._data.value.find(est => est[param] === value);
  }

  async add(req: Student, avatar?: string) {
    const { id, ...data } = req;
    data.createdAt = serverTimestamp();
    if (this._classRoomId) data.classRoomId = this._classRoomId;
    const docReference = doc(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName, id);
    await setDoc(docReference, data);
    if (avatar) this.uploadAvatar(avatar, id);
    return;
  }


  async findOrAdd(student: Student) {
    const { id, ...data } = student;
    // console.log(id);
    const docReference = doc(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName, id.toString());
    const res = await getDoc(docReference);
    if (!res.exists()) {
      student.createdAt = serverTimestamp();
      await setDoc(docReference, data);
    }
  }

  async edit(req: Student | any, avatar?: string) {
    const { id, ...data } = req;
    const docReference = doc(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName, id);
    await updateDoc(docReference, data as any);
    if (avatar) this.uploadAvatar(avatar, id);
    return;
  }

  async delete(id) {
    const docReference = doc(this.firestore,
      'establishments', this._establishmentId,
      'school-years', this._schoolYearId,
      this.collectionName, id);
    return await deleteDoc(docReference);
  }

  async uploadAvatar(avatar: string, id: string) {
    try {
      const savedAvatar = await this.uploadService.post('avatar/', avatar, [this._establishmentId, this._schoolYearId, id]);
      this.edit({ id, avatar: savedAvatar });
    } catch (err) {
      console.log(err.message);
      this.alertService.presentToastError('Echec de l\'upload du avatar!');
    }
  }

  private listen() {
    // let q = query(this.dataCollection, orderBy('firstName'), orderBy('lastName'));
    // if (this._classRoomId) {
      const q = query(this.dataCollection,
        where('classRoomId', '==', this._classRoomId)
      );
    // }
    onSnapshot(q, snapshot => {
      this._data.next(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));
    });
  }

}
