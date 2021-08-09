import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/auth';

import { throwError, of, Observable } from 'rxjs';
import {
  catchError,
  map,
  pluck,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { User, UserInfo } from '../@models/user';
import { mapUser } from './utils';

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser$ = this.auth.authState.pipe(
    map((user) => (user ? mapUser(user) : null))
  );

  readonly claims$ = this.auth.idTokenResult.pipe(
    map((res) => (res ? res.claims : {}))
  );

  readonly userInfo$: Observable<UserInfo | null> = this.currentUser$.pipe(
    switchMap((user) => (user ? this.getUser(user.uid) : of(null))),
    catchError((err) => throwError(err))
  );

  readonly sucursal$ = this.userInfo$.pipe(pluck('sucursal'), shareReplay(1));

  canCreateSolicitudes$ = this.claims$.pipe(
    map((claims) => claims['xpapDepositosCrear'])
  );

  canAutoriceSolicitudes$ = this.claims$.pipe(
    map((claims) => claims['xpapDepositosAutorizar'])
  );

  constructor(
    private http: HttpClient,
    public readonly auth: AngularFireAuth,
    private readonly firestore: AngularFirestore
  ) {}

  async singOut() {
    await this.auth.signOut();
  }

  async signInAnonymously() {
    const { user } = await this.auth.signInAnonymously();
    return mapUser(user);
  }

  async signIn(email: string, password: string) {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error) {
      let message = null;
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuario no registrado';
          break;
        case 'auth/wrong-password':
          message = 'Nombre de corrreo ó contraseña incorrectas';
          break;
        default:
          message = error.message;
          break;
      }
      throw new Error(message);
    }
  }

  sendEmailVerification(user: User) {
    return user.firebaseUser.sendEmailVerification({
      url: location.origin,
      handleCodeInApp: false,
    });
  }

  updateProfile(profile: { displayName: string }) {
    return this.currentUser$.pipe(
      take(1),
      switchMap(async (user) => {
        await user.firebaseUser.updateProfile(profile);
        return user;
      }),
      switchMap(
        async (user) => await this.updateProfileInUsers(user.uid, profile)
      )
    );
  }

  getUser(uid: string) {
    return this.firestore.doc<UserInfo>(`usuarios/${uid}`).valueChanges();
  }

  getUserByUid(uid: string): Observable<UserInfo> {
    return this.firestore
      .collection<UserInfo>('usuarios')
      .doc(uid)
      .valueChanges({ idField: 'uid' });
  }

  async updateSucursal(user: UserInfo, sucursal: string) {
    await this.firestore
      .collection('usuarios')
      .doc(user.uid)
      .update({ sucursal });
  }

  async updateProfileInUsers(uid: string, profile: any) {
    await this.firestore.collection('usuarios').doc(uid).update(profile);
  }
}
