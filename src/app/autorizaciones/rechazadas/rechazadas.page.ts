import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '@papx/data-access';

@Component({
  selector: 'app-rechazadas',
  templateUrl: './rechazadas.page.html',
  styleUrls: ['./rechazadas.page.scss'],
})
export class RechazadasPage implements OnInit {
  rechazadas$ = this.service.rechazadas$;
  constructor(private service: SolicitudesService) {}

  ngOnInit() {}
}
