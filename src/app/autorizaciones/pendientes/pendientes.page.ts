import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { groupBy, mapValues, sumBy } from 'lodash-es';

import { SolicitudesService } from '@papx/data-access';
import {
  Autorizacion,
  AutorizacionRechazo,
  SolicitudDeDeposito,
  User,
} from '@papx/models';
import { BaseComponent } from 'src/app/core';
import { SolicitudCardComponent } from '@papx/shared/ui-solicitudes/solicitud-card/solicitud-card.component';
import {
  AlertController,
  LoadingController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { AutorizarModalComponent } from './autorizar-modal/autorizar-modal.component';
import { AuthService } from '@papx/auth';

import { SolicitudPendienteModalComponent } from './pendiente-modal/pendiente-modal.component';
import { RechazarModalComponent } from './rechazar-modal/rechazar-modal.component';
import { CatalogosService } from 'src/app/@data-access/services/catalogos.service';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage extends BaseComponent implements OnInit {
  STORAGE_KEY = 'sx-depositos-pwa.autorizaciones.pendientes';
  pendientes$: Observable<SolicitudDeDeposito[]>;
  _pauseResume$ = new BehaviorSubject<boolean>(true);
  @ViewChildren(SolicitudCardComponent)
  elements: QueryList<SolicitudCardComponent>;
  session$ = this.auth.currentUser$;

  timer$ = timer(5000, 60000 * 5).pipe(
    withLatestFrom(this._pauseResume$),
    takeUntil(this.destroy$),
    filter(([time, val]) => val),
    tap(([time, val]) => this.refreshRetraso(time))
  );
  config: { view: 'cards' | 'list'; filtrar: string } = this.loadConfig();

  sucursales = this.catalogoService.sucursales.sort((a1, b1) =>
    a1.sort > b1.sort ? 1 : a1.sort === b1.sort ? 0 : -1
  );

  sucursal$ = new BehaviorSubject('OFICINAS');
  porSucursal$;

  constructor(
    private service: SolicitudesService,
    private catalogoService: CatalogosService,
    private auth: AuthService,
    private modal: ModalController,
    private alertController: AlertController,
    private loading: LoadingController,
    private popover: PopoverController
  ) {
    super();
  }

  ngOnInit() {
    this.pendientes$ = combineLatest([
      this.service.pendientesPorAutorizar$,
      this.sucursal$,
    ]).pipe(
      map(([rows, sucursal]) => {
        return rows
          .sort((a, b) =>
            a.folio > b.folio ? 1 : a.folio === b.folio ? 0 : -1
          )
          .filter((item) => item.sucursal === sucursal);
      })
    );

    this.porSucursal$ = this.service.pendientesPorAutorizar$.pipe(
      map((rows) => groupBy(rows, 'sucursal')),
      map((grupos) => mapValues(grupos, (o) => o.length))
    );

    this.timer$.subscribe(
      () => {},
      () => {},
      () => console.log('COMPLETE PULLING')
    );
  }

  private refreshRetraso(time: number) {
    this.elements.forEach((item) => item.updateRetraso());
  }

  /**
   * Start refreshing retraso
   */
  ionViewDidEnter() {
    this._pauseResume$.next(true);
  }
  /**
   * Stop refreshing retraso
   */
  ionViewDidLeave() {
    this._pauseResume$.next(false);
  }

  segmentChanged({ detail: { value } }: any) {
    this.sucursal$.next(value);
  }

  async onSelection(solicitud: Partial<SolicitudDeDeposito>, user: User) {
    const modal = await this.modal.create({
      component: SolicitudPendienteModalComponent,
      cssClass: 'solicitud-pendiente-modal',
      mode: 'ios',
      componentProps: {
        solicitud,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      if (data.resultado === 'autorizar')
        return this.onAutorizar(solicitud, user);
      if (data.resultado === 'rechazar')
        return this.onRechazar(solicitud, user);
    }
  }

  async onAutorizar(solicitud: Partial<SolicitudDeDeposito>, user: User) {
    // console.log('Autorizar: ', solicitud);
    const duplicados = await this.service.buscarDuplicado(solicitud);
    const posibleDuplicado = duplicados.length > 0 ? duplicados[0] : null;
    // console.log('Posible duplicado: ', posibleDuplicado);
    const modal = await this.popover.create({
      component: AutorizarModalComponent,
      componentProps: { solicitud, posibleDuplicado },
      cssClass: 'solicitud-autorizar-popover',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const { uid, displayName } = user;
      const autorizacion: Autorizacion = {
        ...data,
        uid,
        createUser: displayName,
      };
      if (posibleDuplicado) {
        autorizacion.comentario =
          'SE AUTORIZO CON POSIBLE DUPLICADO REF: ' + posibleDuplicado.id;
      }
      // console.log('Autorizar solicitud: ', autorizacion);
      this.service.autorizar(
        solicitud.id,
        autorizacion,
        posibleDuplicado ? posibleDuplicado.id : null
      );
    }
  }

  async onRechazar(solicitud: Partial<SolicitudDeDeposito>, user: User) {
    const pop = await this.popover.create({
      component: RechazarModalComponent,
      componentProps: { solicitud },
      cssClass: 'solicitud-rechazo-popover',
      animated: true,
      mode: 'md',
      showBackdrop: false,
      translucent: false,
    });
    await pop.present();
    const { data } = await pop.onWillDismiss();
    if (data) {
      try {
        await this.startLoading('Registrando rechazo');
        const payload: AutorizacionRechazo = {
          motivo: data.motivo,
          comentario: data.comentario,
          uid: user.uid,
          userName: user.displayName,
        };
        await this.service.rechazar(solicitud.id, payload);
      } catch (err) {
        console.error('ERROR RECHAZANDO SOLICITUD: ', err);
        this.handleError('Error registrando rechazo: ' + err.message);
      } finally {
        await this.loading.dismiss();
      }
    }
  }

  private loadConfig(): any {
    const sjson = localStorage.getItem(this.STORAGE_KEY);
    return sjson ? JSON.parse(sjson) : { view: 'cards', filtrar: 'false' };
  }

  private saveConfig() {
    const sjson = JSON.stringify(this.config);
    localStorage.setItem(this.STORAGE_KEY, sjson);
  }

  changeView(view: 'list' | 'cards') {
    this.config = { ...this.config, view };
    this.saveConfig();
  }

  async startLoading(message = 'Procesando') {
    const loading = await this.loading.create({
      message,
    });
    loading.present();
  }

  async handleError(err) {
    const a = await this.alertController.create({
      header: 'Error en Firebase',
      message: err,
      mode: 'ios',
      animated: true,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await a.present();
  }
}
