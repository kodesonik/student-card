import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, getAuth, authState } from '@angular/fire/auth';
import { getApp } from '@firebase/app';
import { signOut } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth;

  constructor() {
    this.auth = getAuth(getApp());
  }

  getAuthState() {
    return authState(this.auth);
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    return await signOut(this.auth);
  }

}
