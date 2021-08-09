import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';
import { SolicitudesService } from '@papx/data-access';
import { SolicitudDeDeposito, UserInfo } from '@papx/models';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core';

import orderBy from 'lodash-es/orderBy';

@Component({
  selector: 'papx-solicitudes-rechazadas',
  templateUrl: './rechazadas.page.html',
  styleUrls: ['./rechazadas.page.scss'],
})
export class RechazadasPage extends BaseComponent implements OnInit {
  solicitudes$: Observable<SolicitudDeDeposito[]>;
  user: UserInfo;

  constructor(private service: SolicitudesService, private auth: AuthService) {
    super();
  }

  ngOnInit() {
    this.auth.userInfo$.pipe(takeUntil(this.destroy$)).subscribe((info) => {
      this.user = info;
      this.load(this.user.sucursal);
    });
    // this.solicitudes = this.service.findPorSucursal();
  }

  private load(sucursal: string) {
    this.solicitudes$ = this.service
      .findRechazadas(sucursal)
      .pipe(map((rows) => orderBy(rows, ['folio'], ['desc'])));
  }
}
