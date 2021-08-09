import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitud-pendiente-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Solicitud por autorizar</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-label>Cerrar</ion-label>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <papx-solicitud-card [solicitud]="solicitud">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button color="success" (click)="autorizar(solicitud)">
              <ion-label>Autorizar </ion-label>
              <ion-icon name="checkmark-done" slot="start"></ion-icon>
            </ion-button>
            <ion-button color="danger" (click)="rechazar(solicitud)">
              <ion-label>Rechazar</ion-label>
              <ion-icon name="arrow-undo" slot="start"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </papx-solicitud-card>
      <ion-grid *ngIf="solicitud.rechasosAnteriores" class="ion-padding">
        <ion-row>
          <ion-col size="12">
            <ion-label class="ion-text-center">
              <h2>Rechazos anteriores</h2>
            </ion-label>
          </ion-col>
        </ion-row>
        <ion-row *ngFor="let r of solicitud.rechasosAnteriores">
          <ion-col>
            <papx-rechazo-info [rechazo]="r"></papx-rechazo-info>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class SolicitudPendienteModalComponent implements OnInit {
  @Input() solicitud: SolicitudDeDeposito;
  constructor(private controller: ModalController) {}

  ngOnInit() {}

  autorizar(sol: SolicitudDeDeposito) {
    this.controller.dismiss({ resultado: 'autorizar' });
  }
  rechazar(sol: SolicitudDeDeposito) {
    this.controller.dismiss({ resultado: 'rechazar' });
  }

  async close() {
    await this.controller.dismiss({ resultado: null });
  }
}
