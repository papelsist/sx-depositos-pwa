import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitudes-cards-view',
  template: ` <ion-grid class="ion-no-padding">
    <ion-row>
      <ion-col
        size="12"
        size-sm="6"
        size-lg="4"
        *ngFor="let solicitud of solicitudes"
      >
        <papx-solicitud-card [solicitud]="solicitud"></papx-solicitud-card>
      </ion-col>
    </ion-row>
  </ion-grid>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesCardsViewComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[];
  constructor() {}

  ngOnInit() {}
}
