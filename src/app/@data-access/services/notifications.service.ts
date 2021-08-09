import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AlertController, ToastController } from '@ionic/angular';

import { UserInfo } from '@papx/models';
import { Subject } from 'rxjs';

import { map, mergeMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  token: string;
  // token$ = this.afm.getToken.pipe(tap((token) => {
  //   // (this.token = token)
  // }));
  token$ = new Subject<string>();

  registeredTopics = JSON.parse(
    localStorage.getItem('papx.notificaciones.topics') || '{}'
  );

  topics = {
    newSolicitudCreated: false,
  };

  constructor(
    private afm: AngularFireMessaging,
    private firestore: AngularFirestore,
    private functions: AngularFireFunctions,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.afm.getToken.subscribe((token) => this.token$.next(token));
  }

  async enableNotifications(user: UserInfo, claims: any) {
    this.afm.requestToken.subscribe(async (token) => {
      this.token$.next(token);
      // const deviceTokens = user.deviceTokens ?? {};
      // deviceTokens[token] = true;
      await this.firestore.doc(`usuarios/${user.uid}`).update({ token });
      const { xpapDepositosAutorizar } = claims;
      if (xpapDepositosAutorizar) {
        this.subscribeToNewSolicitudes(token);
      }
    });
  }

  disableNotifications(user: UserInfo, claims: any) {
    this.afm.getToken
      .pipe(
        mergeMap((token) => {
          return this.afm
            .deleteToken(token)
            .pipe(map((res) => (res ? token : null)));
        })
      )
      .subscribe(async (token) => {
        if (token) {
          this.token$.next(null);
          // console.log('Quitando token: ', token);
          // const deviceTokens = user.deviceTokens ?? {};
          // if (deviceTokens[token]) {
          //   delete deviceTokens[token];
          //   await this.firestore
          //     .doc(`usuarios/${user.uid}`)
          //     .update({ deviceTokens });
          // }
          const { xpapDepositosAutorizar } = claims;
          if (xpapDepositosAutorizar) {
            this.unsubscribeToNewSolicitudes(token);
          }
        }
      });
  }

  subscribeToNewSolicitudes(token: string) {
    this.subscribeToTopic(
      token,
      'newSolicitudCreated',
      'Registrado para recibir notificaciones de nuevas solicitudes'
    );
  }

  unsubscribeToNewSolicitudes(token: string) {
    this.unsubscribeToTopic(token, 'newSolicitudCreated');
  }

  subscribeToTopic(token: string, topic: string, successMessage: string) {
    const callable = this.functions.httpsCallable('subscribeToTopic');
    callable({ token, topic }).subscribe(
      (res) => {
        console.log('Subscripcion  del token %s al topic: %s', token, topic);
        this.registeredTopics[topic] = true;
        this.showToast(successMessage, 'Subscripción registrada');
      },
      (err) => {
        console.error(err);
        console.error(
          'Error suscribiendo el token %s al topic: %s',
          token,
          topic
        );

        this.handleError(err);
      }
    );
  }

  unsubscribeToTopic(token: string, topic: string) {
    const callable = this.functions.httpsCallable('unsubscribeToTopic');
    callable({ token, topic }).subscribe(
      (res) => {
        this.registeredTopics[topic] = false;
        this.showToast('Topic: ' + topic, 'Subscripción cancelada');
      },
      (err) => this.handleError(err)
    );
  }

  showMessage() {
    this.afm.messages.pipe(
      tap((msg) => {
        const body: any = (msg as any).notification.body;
        this.showToast(body);
      })
    );
  }

  sendTestTokenMessage(token: string) {
    console.log('Mensaje de prueba a: ', token);
    this.functions
      .httpsCallable('sendMessageToToken')({ token })
      .subscribe(
        (res) => console.log('Message sent ok ', res),
        (err) => this.handleError(err)
      );
  }

  async showToast(message: any, header = 'Notificación') {
    const toast = await this.toastController.create({
      header,
      message,
      color: 'warning',
      duration: 6000,
      position: 'bottom',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  async handleError(err: any) {
    const alert = await this.alertController.create({
      header: 'Firebase error',
      subHeader: 'FCM exception',
      message: err.message,
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }
}
