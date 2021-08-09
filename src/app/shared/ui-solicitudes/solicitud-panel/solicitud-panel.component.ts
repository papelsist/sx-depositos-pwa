import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitud-panel',
  template: `
    <div>
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <ion-item class="ion-text-center">
              <ion-label>
                <div class="total">
                  <span class="ion-padding-end">Total:</span>
                  <ion-text color="success">
                    <strong>{{ total | currency }}</strong>
                  </ion-text>
                </div>
              </ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row *ngIf="solicitud.cheque > 0.0 || solicitud.efectivo > 0.0">
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="floating">Efectivo:</ion-label>
              <ion-input
                [value]="solicitud.efectivo | currency"
                color="primary"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="floating">Cheque:</ion-label>
              <ion-input
                [value]="solicitud.cheque | currency"
                color="primary"
              ></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label>
                <span>Cuenta:</span>
                <span class="ion-padding-start">{{ cuenta }}</span>
              </ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label>
                <span>Origen: </span>
                <span class="ion-padding-start">{{ banco }}</span>
              </ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="floating">Fecha depósito:</ion-label>
              <ion-input
                [value]="solicitud.fechaDeposito | date: 'dd/MM/yyyy'"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="floating">Referencia:</ion-label>
              <ion-input [value]="solicitud.referencia"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="floating">Solicitó:</ion-label>
              <ion-input
                [value]="solicitud.solicita"
                placeholder="Vendedor solicitante"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="floating">Sucursal:</ion-label>
              <ion-input
                [value]="solicitud.sucursal"
                placeholder="Sucursal origen"
              ></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <ion-item>
              <ion-label position="floating">Cliente:</ion-label>
              <ion-input [value]="solicitud.cliente.nombre"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="floating">Creado:</ion-label>
              <ion-input
                [value]="solicitud.dateCreated | date: 'dd/MM/yyyy: HH:mm'"
                placeholder="Fecha y hora de creación"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="floating">Status:</ion-label>
              <ion-input [value]="solicitud.status"></ion-input>
              <ion-icon
                *ngIf="solicitud.status === 'AUTORIZADO'"
                slot="end"
                name="checkmark-done-outline"
                color="success"
              ></ion-icon>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  `,
  styleUrls: ['./solicitud-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudPanelComponent implements OnInit {
  @Input() solicitud: SolicitudDeDeposito;
  constructor() {}

  ngOnInit() {}

  get total() {
    return this.solicitud.total;
  }

  get cuenta() {
    return `${this.solicitud.cuenta.descripcion} (${this.solicitud.cuenta.numero})`;
  }

  get banco() {
    return this.solicitud.banco.nombre;
  }

  get cliente() {
    return this.solicitud.cliente.nombre;
  }
}
