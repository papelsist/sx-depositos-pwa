import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// libs
import { throwIfAlreadyLoaded } from '@papx/utils';

// app
import { environment } from '../../environments/environment';
import { DataAccessModule } from '@papx/data-access';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '../@auth/auth.module';

@NgModule({
  imports: [CommonModule, HttpClientModule, DataAccessModule, AuthModule],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
