import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../@data-access/services/notifications.service';

@Component({
  selector: 'papx-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  appVersion = '1.0.36 (24/06/2021 12:00)';
  vm$ = combineLatest([
    this.notificationService.token$,
    this.auth.userInfo$,
    this.auth.claims$,
    this.auth.canAutoriceSolicitudes$,
  ]).pipe(
    map(([token, user, claims, canAutorizar]) => ({
      token,
      user,
      claims,
      canAutorizar,
    }))
  );

  constructor(
    private auth: AuthService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit() {}

  autorizarNotificaciones(config: any) {
    const { user, claims } = config;
    this.notificationService.enableNotifications(user, claims);
  }

  cancelarNotificaciones(config: any) {
    const { token, user, claims } = config;
    this.notificationService.disableNotifications(user, claims);
  }

  testTokenMessage(token: string) {
    this.notificationService.sendTestTokenMessage(token);
  }
}
