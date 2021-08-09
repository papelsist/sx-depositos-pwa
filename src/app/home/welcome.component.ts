import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'papx-welcome',
  template: `
    <ion-card>
      <img
        class="banner-img"
        src="https://firebasestorage.googleapis.com/v0/b/papx-ws-prod.appspot.com/o/images%2Flogo.svg?alt=media&token=c957d196-9ee4-4597-9291-189f393cc2b7"
      />
      <ion-card-header>
        <ion-card-title>SX-DEPOSITOS</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-text color="medium">
          <h2>
            Bienvenido
            <ion-text color="primary">
              {{ displayName }}
            </ion-text>
            al sistema de registro y autorización de solicitudes de depósitos
            <span> (transferencias bancarias) </span>
          </h2>
        </ion-text>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .actions {
        display: flex;
        justify-content: center;
      }
      .banner-img {
        max-width: 100%;
        max-height: 600px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  @Input() displayName = 'Falta Display name';
  @Input() lastAccess;
  constructor() {}

  ngOnInit() {}
}
