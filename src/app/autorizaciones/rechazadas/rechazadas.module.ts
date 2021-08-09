import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechazadasPageRoutingModule } from './rechazadas-routing.module';

import { RechazadasPage } from './rechazadas.page';
import { RechazadaPage } from './rechazada/rechazada.page';
import { SharedUiSolicitudesModule } from '@papx/shared/ui-solicitudes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiSolicitudesModule,
    RechazadasPageRoutingModule,
  ],
  declarations: [RechazadasPage, RechazadaPage],
})
export class RechazadasPageModule {}
