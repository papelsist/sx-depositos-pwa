import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PendientesPage } from './pendientes.page';
import { SharedUiSolicitudesModule } from '@papx/shared/ui-solicitudes';
import { AutorizarModalComponent } from './autorizar-modal/autorizar-modal.component';
import { PendientesCardsViewComponent } from './card-view/pendientes-cards-view.component';
import { SolicitudPendienteModalComponent } from './pendiente-modal/pendiente-modal.component';
import { RechazarModalComponent } from './rechazar-modal/rechazar-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PendientesPage,
      },
    ]),
    SharedUiSolicitudesModule,
  ],
  declarations: [
    PendientesPage,
    AutorizarModalComponent,
    PendientesCardsViewComponent,
    SolicitudPendienteModalComponent,
    RechazarModalComponent,
  ],
})
export class PendientesPageModule {}
