import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from '@papx/utils';

@NgModule({
  imports: [CommonModule],
})
export class SharedBancosDataAccessModule {
  constructor(
    @Optional() @SkipSelf() parentModule?: SharedBancosDataAccessModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'SharedBancosDataAccessModule');
  }
}
