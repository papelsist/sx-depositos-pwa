import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesTabPageRoutingModule } from './solicitudes-tab-routing.module';

import { SolicitudesTabPage } from './solicitudes-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesTabPageRoutingModule
  ],
  declarations: [SolicitudesTabPage]
})
export class SolicitudesTabPageModule {}
