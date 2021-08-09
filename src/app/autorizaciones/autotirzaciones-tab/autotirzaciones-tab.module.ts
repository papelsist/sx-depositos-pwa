import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutotirzacionesTabPageRoutingModule } from './autotirzaciones-tab-routing.module';

import { AutotirzacionesTabPage } from './autotirzaciones-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutotirzacionesTabPageRoutingModule
  ],
  declarations: [AutotirzacionesTabPage]
})
export class AutotirzacionesTabPageModule {}
