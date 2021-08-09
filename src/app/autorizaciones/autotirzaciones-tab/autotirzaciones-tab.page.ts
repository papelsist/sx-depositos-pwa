import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '@papx/data-access';

@Component({
  selector: 'app-autotirzaciones-tab',
  templateUrl: './autotirzaciones-tab.page.html',
  styleUrls: ['./autotirzaciones-tab.page.scss'],
})
export class AutotirzacionesTabPage implements OnInit {
  pendientesCount$ = this.service.pendientesPorAutorizarCount$;
  rechazadasCount$ = this.service.rechazadasCount$;
  constructor(private service: SolicitudesService) {}

  ngOnInit() {}

  getPendientesColor(pendientes: number): string {
    return pendientes <= 3
      ? 'success'
      : pendientes > 3 && pendientes <= 6
      ? 'warning'
      : 'danger';
  }
}
