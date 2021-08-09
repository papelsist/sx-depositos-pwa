import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SolicitudesFacade } from 'src/app/@data-access/+state/solicitudes.facade';
import { BaseComponent } from 'src/app/core';

@Component({
  selector: 'papx-solicitudes-tab',
  templateUrl: './solicitudes-tab.page.html',
  styleUrls: ['./solicitudes-tab.page.scss'],
})
export class SolicitudesTabPage extends BaseComponent implements OnInit {
  title = 'Tab ';
  // pendientesCount$:

  constructor(private facade: SolicitudesFacade) {
    super();
  }

  ngOnInit() {}
}
