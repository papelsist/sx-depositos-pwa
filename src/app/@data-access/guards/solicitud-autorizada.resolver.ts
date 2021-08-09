import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SolicitudesService } from '../solicitudes.service';
import { SolicitudDeDeposito } from '@papx/models';

@Injectable({ providedIn: 'root' })
export class SolicitudAutorizadaResolver
  implements Resolve<SolicitudDeDeposito> {
  constructor(private service: SolicitudesService) {
    console.log('Inicializando router resolver....');
  }
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    /*
    return this.service.autorizadas$.pipe(
      map(
        (autorizadas) => {
          const found = autorizadas.find((item) => item.id === id);
          console.log('Fund: ', found);
          return found;
        },
        catchError((error) => {
          console.log('ERror: ', error);
          return EMPTY;
        })
      )
    );
    */
    return this.service.get(id);
  }
}
