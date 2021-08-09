import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(private alertController: AlertController) {}

  async handleFirebaseError(error: any) {
    return this.handleError('Firebase error', null, error.message);
  }

  async handleError(message: string, header?: string, subHeader?: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
    });
    await alert.present();
  }
}
