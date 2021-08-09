import { Component, ErrorHandler, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '@papx/auth';
import { UserInfo } from '@papx/models';

import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NotificationsService } from 'src/app/@data-access/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  token$ = this.service.token$;
  user$ = this.auth.userInfo$;
  vm$ = combineLatest([this.token$, this.user$]).pipe(
    map(([token, user]) => ({ token, user }))
  );

  STORAGE_KEY = 'papx.notificacions';

  config = {
    newSolicitudCreated: false,
  };

  constructor(
    private service: NotificationsService,
    private auth: AuthService,
    private errorHandler: ErrorHandler
  ) {}

  ngOnInit() {
    this.auth.claims$.subscribe((claims) =>
      console.log('Current claims: ', claims)
    );
  }

  autorizar(user: UserInfo) {
    // this.service.requestPermission(user);
  }

  cancelar(token: string, user: UserInfo) {
    // this.service.deleteToken(token, user);
  }

  tooglePendientes(token: string, { detail: { checked } }: any) {
    // const topic = 'newSolicitudCreated2';
    if (!checked) {
      // this.service.unsubscribeToTopic(token, topic);
      this.service.unsubscribeToNewSolicitudes(token);
    } else {
      // this.service.subscribeToTopic(token, topic);
      this.service.subscribeToNewSolicitudes(token);
    }
  }
}
