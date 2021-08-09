import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-pendientes-cards-view',
  template: ` <ion-grid class="ion-no-padding">
    <ion-row>
      <ion-col
        size="12"
        size-md="6"
        size-lg="4"
        *ngFor="let solicitud of solicitudes"
      >
        <papx-solicitud-card [solicitud]="solicitud">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button color="medium" (click)="rechazar.emit(solicitud)">
                <ion-label>Rechazar</ion-label>
                <ion-icon name="arrow-undo" slot="start"></ion-icon>
              </ion-button>
              <ion-button color="primary" (click)="autorizar.emit(solicitud)">
                <ion-label>Autorizar </ion-label>
                <ion-icon name="checkmark-done" slot="start"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </papx-solicitud-card>
      </ion-col>
    </ion-row>
  </ion-grid>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendientesCardsViewComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[];
  @Output() autorizar = new EventEmitter<Partial<SolicitudDeDeposito>>();
  @Output() rechazar = new EventEmitter<Partial<SolicitudDeDeposito>>();
  constructor() {}

  ngOnInit() {}
}
