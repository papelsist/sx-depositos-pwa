import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudesService } from '@papx/data-access';
import { SolicitudDeDeposito } from '@papx/models';
import { Observable } from 'rxjs';
import { finalize, map, shareReplay, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'papx-rechazada',
  templateUrl: './rechazada.page.html',
  styleUrls: ['./rechazada.page.scss'],
})
export class RechazadaPage implements OnInit {
  solicitud$: Observable<SolicitudDeDeposito>;
  constructor(
    private route: ActivatedRoute,
    private service: SolicitudesService
  ) {}

  ngOnInit() {
    this.loadSolicitud();
  }

  private loadSolicitud() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
    });
    this.solicitud$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) =>
        this.service.rechazadas$.pipe(
          map((rows) => rows.find((item) => item.id === id))
        )
      ),
      shareReplay()
    );
  }

  getTitle(sol: SolicitudDeDeposito) {
    return sol.transferencia > 0.0 ? 'Transferencia' : 'Depósito';
  }
}
