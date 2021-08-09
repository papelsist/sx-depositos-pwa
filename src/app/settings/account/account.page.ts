import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '@papx/auth';
import { UserInfo } from '@papx/models';
import { map } from 'rxjs/operators';

import { CatalogosService } from 'src/app/@data-access/services/catalogos.service';
import { Depositos } from '@papx/models';
import pickBy from 'lodash-es/pickBy';

import firebase from 'firebase/app';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {
  user$ = this.service.userInfo$;
  firebaseUser$ = this.service.currentUser$;
  claims$ = this.service.claims$.pipe(
    map((claim) =>
      pickBy(claim, (value, key) => key.startsWith('xpapDepositos') && value)
    )
  );
  constructor(
    private service: AuthService,
    private alertController: AlertController,
    private catalogos: CatalogosService
  ) {}

  async modificarSucursal(user: UserInfo) {
    const inputs: any[] = this.catalogos.sucursales.map((item) => ({
      name: item.nombre,
      type: 'radio',
      label: item.label,
      value: item.nombre,
      checked: user.sucursal === item.nombre,
    }));
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sucursales',
      inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Aceptar',
          handler: (value) => {
            this.updateSucursal(user, value);
          },
        },
      ],
    });

    await alert.present();
  }

  updateSucursal(user: UserInfo, sucursal: string) {
    this.service.updateSucursal(user, sucursal);
  }

  getRoleLabel(role: string) {
    const res = Depositos.RolesMap[role];
    return res ?? role;
  }

  async modificarDisplayName(user: firebase.User, current: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sucursales',
      inputs: [
        {
          tabindex: 0,
          label: 'Nombre corto',
          name: 'displayName',
          value: current,
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Aceptar',
          handler: async (value) => {
            this.service.updateProfile(value).subscribe(
              () => console.log('Profile updated'),
              (err) => console.error('Error actualizando firebase user ', err)
            );
          },
        },
      ],
    });

    await alert.present();
  }
}
