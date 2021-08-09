import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { BehaviorSubject, Observable, timer, combineLatest, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { SolicitudesService, NotificationsService } from '@papx/data-access';
import { SolicitudDeDeposito, User, UserInfo } from '@papx/models';
import { AuthService } from '@papx/auth';

import { BaseComponent } from 'src/app/core';
import { AlertController, ModalController } from '@ionic/angular';
import { SolicitudDetailModalComponent } from '@papx/shared/ui-solicitudes/solicitud-detail-modal/solicitud-detail-modal.component';

@Component({
  selector: 'papx-solicitudes-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage extends BaseComponent implements OnInit {
  view: 'list' | 'cards' = 'list';

  filtrar$ = new BehaviorSubject<boolean>(true);

  user$ = this.authService.userInfo$;

  pendientes$ = this.user$.pipe(
    switchMap((user) =>
      user ? this.service.findPendientesBySucursal(user.sucursal) : []
    ),
    map((rows) => rows.filter((item) => !item.callcenter)),
    map((rows) =>
      rows.sort((a, b) =>
        a.folio > b.folio ? 1 : a.folio === b.folio ? 0 : -1
      )
    )
  );

  vm$ = combineLatest([
    this.filtrar$,
    this.pendientes$,
    this.authService.userInfo$,
    this.notificationsService.token$,
  ]).pipe(
    map(([filtrar, pendientes, user, token]) => ({
      filtrar,
      pendientes: filtrar
        ? pendientes.filter((item) => item.createUserUid === user.uid)
        : pendientes,
      user,
      sucursal: user.sucursal,
      token,
    }))
  );

  constructor(
    private service: SolicitudesService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    super();
  }

  ngOnInit() {
    // small bug, some observable does not emit a value
    this.vm$.pipe(takeUntil(this.destroy$)).subscribe((value) => {});
  }

  changeView(view: 'list' | 'cards') {
    this.view = view;
  }

  filtrar(value: boolean) {
    this.filtrar$.next(!value);
  }

  async onSelection(solicitud: SolicitudDeDeposito) {
    const modal = await this.modalController.create({
      component: SolicitudDetailModalComponent,
      cssClass: 'solicitud-detail-modal',
      mode: 'ios',
      componentProps: {
        solicitud,
      },
    });
    return await modal.present();
  }

  async registrarNotificaciones(user: UserInfo, token?: string) {
    // console.log('Registrando notificaciones...', user, token);
    if (token) {
      const alert = await this.alertController.create({
        header: 'Subscripción a notificaciones',
        message:
          'Ya está registrado para recibir notificaciones, desea registrase nuevamente?',
        animated: true,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Aceptar',
            role: 'accept',
            handler: async () => {
              await this.notificationsService.enableNotifications(user, {});
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.notificationsService.enableNotifications(user, {});
    }
  }
}
