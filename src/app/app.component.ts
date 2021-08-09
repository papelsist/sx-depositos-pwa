import { Component, OnInit } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';

import { AngularFireMessaging } from '@angular/fire/messaging';

import { AuthService } from './@auth/auth.service';
import { Router } from '@angular/router';
import { DisplayModeService } from './core/display-mode.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user$ = this.authService.currentUser$;
  accesarSolicitudes$ = this.authService.canCreateSolicitudes$;
  accesarAutorizaciones$ = this.authService.canAutoriceSolicitudes$;
  projectId = environment.firebaseConfig.projectId;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private displayService: DisplayModeService,
    private afm: AngularFireMessaging,
    private toastController: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.displayService.startDarkMode();
  }

  ngOnInit() {
    // this.logSecurityState();
    this.afm.messages.subscribe((msg: any) => {
      console.log('Message from FCM: ', msg);
      const { title, body } = msg.notification;
      this.showMessage(title, body);
    });
  }

  /**
   * Temporal para verificar datos de Firebase auth
   */
  private logSecurityState() {
    this.authService.currentUser$.subscribe((user) =>
      console.log(`User:${user?.displayName} Verified: ${user?.emailVerified}`)
    );

    this.authService.claims$.subscribe((claims) =>
      console.log('Claims: ', claims)
    );
  }

  async signOut() {
    await this.authService.singOut();
    this.router.navigate(['/login']);
  }

  async showMessage(header: string, message: string) {
    const toast = await this.toastController.create({
      header,
      message,
      animated: true,
      duration: 5000,
      color: 'warning',
      buttons: [
        {
          side: 'end',
          icon: 'checkmark',
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
