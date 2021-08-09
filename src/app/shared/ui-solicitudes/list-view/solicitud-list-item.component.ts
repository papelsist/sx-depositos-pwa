import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInHours,
  addBusinessDays,
} from 'date-fns';
import { es } from 'date-fns/locale';

import { SolicitudDeDeposito } from '@papx/models';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'papx-solicitud-list-item',
  template: `
    <ion-item
      detail
      button
      (click)="showDetail(sol)"
      [disabled]="disabled"
      mode="ios"
    >
      <ion-label>
        <ion-grid>
          <ion-row>
            <!-- 1 Importes -->
            <ion-col
              class="ion-text-wrap ion-text-center"
              size-sm="4"
              size-md="2"
              size-lg="2"
            >
              <ion-text [color]="importeColor">
                <h2>{{ sol.total | currency }}</h2>
              </ion-text>
              <p>
                <small>
                  {{
                    sol.transferencia > 0
                      ? 'TRANSF'
                      : sol.cheque > 0
                      ? 'CHEQUE'
                      : 'EFECTIVO'
                  }}
                </small>
              </p>
            </ion-col>

            <!-- 2 Banos -->
            <ion-col size-sm="4" size-md="2" size-lg="2" class="ion-text-wrap">
              <ion-text color="secondary">
                <h5 class="cuenta">
                  {{ sol.cuenta.descripcion }}
                  <strong> ({{ sol.cuenta.numero }}) </strong>
                </h5>
              </ion-text>
              <h5 class="banco-origen">Origen: {{ sol.banco.nombre }}</h5>
            </ion-col>

            <!-- 3 Fechas -->
            <ion-col
              class="ion-text-wrap ion-text-center fechas"
              size-sm="4"
              size-md="2"
              size-lg="2"
            >
              <h5 class="retraso">
                Act: {{ sol.lastUpdated | date: 'dd/MM/yyyy : HH:mm' }}
              </h5>
              <p>Referencia: {{ sol.referencia }}</p>
              <!-- <p>
                <ion-text [color]="retrasoColor">
                  {{ retraso }}
                </ion-text>
              </p> -->
            </ion-col>

            <!-- 4 Cliente -->
            <ion-col
              class="ion-hide-md-down ion-padding-start cliente"
              size-md="3"
              size-lg="3"
            >
              <h5 class="ion-text-wrap ">
                {{ sol.cliente.nombre }}
              </h5>
            </ion-col>

            <!-- 5 Solicita -->
            <ion-col class="ion-hide-md-down" size-md="2" size-lg="3">
              <h5 class="ion-text-wrap ion-text-center solicita">
                {{ sol.solicita }}
              </h5>
              <ion-text color="warning">
                <h5 class="sucursal">
                  ({{ sol.callcenter ? 'CALLCENTER' : sol.sucursal }} )
                </h5>
              </ion-text>
            </ion-col>
          </ion-row>
        </ion-grid>
        <p class="ion-text-wrap ion-hide-md-up">
          <span class="solicita"> Solicita: {{ sol.solicita }} </span>
          <span class="sucursal">
            <ion-text color="warning">
              ({{ sol.callcenter ? 'CALLCENTER' : sol.sucursal }} )
            </ion-text>
          </span>
        </p>
        <p class="ion-text-wrap ion-hide-md-up">
          Cliente: {{ sol.cliente.nombre }}
        </p>
      </ion-label>
      <!-- <ion-icon
        slot="start"
        name="warning"
        size="small"
        [color]="retrasoColor"
        class="ion-hide-md-down"
      ></ion-icon> -->
      <!-- <ion-avatar slot="start">
        {{ sol.folio }}
      </ion-avatar> -->
      <ion-note slot="start" color="primary">
        {{ sol.folio }}
      </ion-note>
    </ion-item>
  `,
  styles: [
    `
      h5 {
        font-size: 0.8rem;
      }
      .cuenta {
        font-weight: bold;
      }
      .banco-origen {
        font-style: italic;
      }
      .importe {
        h2 {
          font-size: 1rem;
          font-weight: bold;
        }
      }
      .fechas {
      }
      .cliente {
      }
      .solicita {
      }
      .sucursal {
        font-size: 0.8rem;
        font-weight: bold;
        font-style: italic;
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudListItemComponent implements OnInit {
  @Input() sol: SolicitudDeDeposito;
  @Input() disabled = false;
  @Input() delegateDrilldown = false;
  @Output() selection = new EventEmitter<SolicitudDeDeposito>();
  retraso: string;
  retrasoHoras: number;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.updateRetraso();
  }

  updateRetraso() {
    let fecha = parseISO(this.sol.lastUpdated);
    if (this.isSBC()) {
      fecha = addBusinessDays(fecha, 1); //addHours(fecha, 24);
    }
    this.retrasoHoras = differenceInHours(new Date(), fecha);
    this.retraso = formatDistanceToNowStrict(fecha, {
      addSuffix: true,
      locale: es,
    });
    // console.log('Retraso horas:', this.retrasoHoras);
  }

  get retrasoColor() {
    if (this.retrasoHoras <= 1) {
      return 'success';
    } else if (this.retrasoHoras > 1 && this.retrasoHoras < 2) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  get importeColor() {
    return this.sol.autorizacion ? 'success' : 'tertiary';
  }

  isSBC() {
    const sbc = this.sol.sbc ?? false;
    const cheque = this.sol.cheque;
    return cheque > 0.0 && sbc;
  }

  async showDetail(solicitud: SolicitudDeDeposito) {
    if (this.disabled) return null;
    if (this.delegateDrilldown) {
      this.selection.emit(solicitud);
      return;
    }
    /*
    const modal = await this.modalController.create({
      component: SolicitudDetailModalComponent,
      cssClass: 'solicitud-detail-modal',
      mode: 'ios',
      componentProps: {
        solicitud,
      },
    });
    return await modal.present();
    */
  }
}
