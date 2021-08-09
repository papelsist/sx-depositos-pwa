import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { throwIfAlreadyLoaded } from '../utils/angular';

const routes: Routes = [
  {
    path: 'pending',
    loadChildren: () =>
      import('./pending/pending.module').then((m) => m.PendingPageModule),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AuthModule {
  constructor(@Optional() @SkipSelf() parentModule?: AuthModule) {
    throwIfAlreadyLoaded(parentModule, 'AuthModule');
  }
}
