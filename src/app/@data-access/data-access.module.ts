import {
  NgModule,
  Optional,
  SkipSelf,
  isDevMode,
  APP_INITIALIZER,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../utils/angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import {
  AngularFireAuth,
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import {
  USE_EMULATOR as USE_FUNCTIONS_EMULATOR,
  ORIGIN as FUNCTIONS_ORIGIN,
  NEW_ORIGIN_BEHAVIOR,
  REGION,
} from '@angular/fire/functions';

import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { environment } from '../../environments/environment';

// export function initializeApp1(afa: AngularFireAuth): any {
//   return () => {
//     return new Promise((resolve: any) => {
//       afa.useEmulator(`http://${location.hostname}:9099/`);
//       setTimeout(() => resolve(), 1000); // delay Angular initialization by 100ms
//     });
//   };
// }

export function initializeApp1(afa: AngularFireAuth): any {
  return () => {
    if (environment.useEmulators) {
      console.info('Using Emulator Auth service...');
      return new Promise((resolve: any) => {
        afa.useEmulator(`http://${location.hostname}:9099/`);
        setTimeout(() => resolve(), 1000); // delay Angular initialization by 100ms
      });
    } else return Promise.resolve(true);
  };
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
  ],
  providers: [
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 9099] : undefined,
    },
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 8080] : undefined,
    },
    {
      provide: USE_FUNCTIONS_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 5001] : undefined,
    },

    { provide: NEW_ORIGIN_BEHAVIOR, useValue: true },
    {
      provide: FUNCTIONS_ORIGIN,
      useFactory: () => (isDevMode() ? undefined : location.origin),
    },
    // { provide: REGION, useValue: 'us-central1' },
    { provide: BUCKET, useValue: environment.firebaseConfig.storageBucket },
    /* Delay the app initialization process by 100ms*/
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp1,
      deps: [AngularFireAuth],
      multi: true,
    },
  ],
})
export class DataAccessModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: DataAccessModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'DataAccessModule');
  }
}
