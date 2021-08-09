import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '@papx/data-access';

import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';

import toNumber from 'lodash-es/toNumber';
import isNumber from 'lodash-es/isNumber';
import isNaN from 'lodash-es/isNaN';
import isEmpty from 'lodash-es/isEmpty';
import { Cliente, SolicitudDeDeposito, User } from '@papx/models';
import { AlertController, ModalController } from '@ionic/angular';

import { ClienteSelectorComponent } from '@papx/shared/ui-clientes';

import { AuthService } from '@papx/auth';

@Component({
  selector: 'app-autorizadas',
  templateUrl: './autorizadas.page.html',
  styleUrls: ['./autorizadas.page.scss'],
})
export class AutorizadasPage implements OnInit {
  private _searchTerm = new BehaviorSubject('');
  private _folio = new BehaviorSubject(null);
  private _filter = new BehaviorSubject(null);

  seartTerm$ = this._searchTerm.asObservable();
  folio$ = this._folio.asObservable();
  filter$ = this._filter.asObservable();

  autorizadas$ = combineLatest([this.filter$, this.folio$]).pipe(
    switchMap(([filter, folio]) =>
      filter
        ? this.service.buscarAutorizadas(filter)
        : folio
        ? this.service.buscarAutorizadasPorFolio(folio)
        : this.service.autorizadas$
    ),
    tap(([filter, folio]) => (this.filter = filter))
  );

  filter = null;

  filteredList$ = combineLatest([this.seartTerm$, this.autorizadas$]).pipe(
    map(([term, rows]) =>
      isEmpty(term)
        ? rows
        : rows.filter((item) => {
            const crit = `${item.folio
              .toString()
              .toLowerCase()} ${item.sucursal.toLowerCase()} ${item.total
              .toString()
              .toLowerCase()}`;
            return crit.includes(term);
          })
    )
  );

  user;

  constructor(
    private service: SolicitudesService,
    private modalController: ModalController,
    private alertController: AlertController,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.currentUser$.pipe(take(1)).subscribe((uu) => (this.user = uu));
  }

  onSearch(event: any) {
    // if (!!event) {
    //   this.filter = event;
    // } else {
    //   this.filter = null;
    // }
    // this.filter
    //   ? (this.autorizadas$ = this.service.buscarAutorizadas(this.filter))
    //   : (this.autorizadas$ = this.service.autorizadas$);
    this._filter.next(event);
  }

  onFilter({ detail: { value } }: any) {
    this._searchTerm.next(value);
  }

  buscarPorFolio(event: any) {
    const folio = toNumber(event);
    if (!isNaN(event)) {
      this._folio.next(folio);
      this._filter.next(null);
    } else {
    }
  }

  async onEdit(sol: SolicitudDeDeposito) {
    const modal = await this.modalController.create({
      component: ClienteSelectorComponent,
      cssClass: 'cteSelector',
      componentProps: {},
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.doCambiarCliente(sol, data);
    }
  }

  async doCambiarCliente(sol: SolicitudDeDeposito, cte: Partial<Cliente>) {
    const alert = await this.alertController.create({
      header: 'Cambio de cliente',
      subHeader: sol.cliente.nombre,
      message: 'A: ' + cte.nombre,
      animated: true,
      cssClass: 'cambio-de-cliente-modal',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => ({
            values: true,
          }),
        },
      ],
    });
    await alert.present();
    const { data } = await alert.onWillDismiss();
    if (data.values) {
      this.service.update({ id: sol.id, changes: { cliente: cte } }, this.user);
    }
  }
}
