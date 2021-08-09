import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendientesPageRoutingModule } from './pendientes-routing.module';

import { PendientesPage } from './pendientes.page';
import { SharedUiSolicitudesModule } from '@papx/shared/ui-solicitudes';
import { SolicitudesCardsViewComponent } from './cards-view/solicitudes-cards-view.component';
// import { SolicitudesListViewComponent } from './list-view/solicitudes-list-view.component';
// import { SolicitudListItemComponent } from './list-view/solicitud-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendientesPageRoutingModule,
    SharedUiSolicitudesModule,
  ],
  declarations: [
    PendientesPage,
    SolicitudesCardsViewComponent,
    // SolicitudesListViewComponent,
    // SolicitudListItemComponent,
  ],
})
export class PendientesPageModule {}
