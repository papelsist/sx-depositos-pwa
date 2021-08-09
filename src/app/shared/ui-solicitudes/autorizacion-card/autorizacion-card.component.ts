import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInHours,
  addBusinessDays,
} from 'date-fns';
import es from 'date-fns/locale/es';

@Component({
  selector: 'papx-autorizacion-card',
  templateUrl: './autorizacion-card.component.html',
  styleUrls: ['./autorizacion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizacionCardComponent implements OnInit {
  @Input() solicitud: SolicitudDeDeposito;
  @Output() autorizar = new EventEmitter<Partial<SolicitudDeDeposito>>();
  @Output() rechazar = new EventEmitter<Partial<SolicitudDeDeposito>>();
  retraso: string;
  retrasoHoras: number;
  constructor() {}

  ngOnInit() {
    this.updateRetraso();
  }

  updateRetraso() {
    let fecha = parseISO(this.solicitud.fecha);
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

  isSBC() {
    const sbc = this.solicitud.sbc ?? false;
    const cheque = this.solicitud.cheque;
    return cheque > 0.0 && sbc;
  }
}
