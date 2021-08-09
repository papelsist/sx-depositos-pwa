import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedUiClientesModule } from '@papx/shared/ui-clientes';
import { SharedUiBancosModule } from '@papx/shared/ui-bancos';
import { SolicitudCardComponent } from './solicitud-card/solicitud-card.component';
import { AutorizacionCardComponent } from './autorizacion-card/autorizacion-card.component';
import { SolicitudPanelComponent } from './solicitud-panel/solicitud-panel.component';
import { AutorizacionPanelComponent } from './autorizacion-panel/autorizacion-panel.component';
import { SolicitudDetailComponent } from './solicitud-detail/solicitud-detail.component';
import { SolicitudDetailModalComponent } from './solicitud-detail-modal/solicitud-detail-modal.component';
import { RechazoInfoComponent } from './rechazo-info/rechazo-info.component';
import { SolicitudesListViewComponent } from './list-view/solicitudes-list-view.component';
import { SolicitudListItemComponent } from './list-view/solicitud-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiClientesModule,
    SharedUiBancosModule,
  ],
  declarations: [
    SolicitudCardComponent,
    AutorizacionCardComponent,
    AutorizacionPanelComponent,
    SolicitudPanelComponent,
    SolicitudDetailComponent,
    SolicitudDetailModalComponent,
    SolicitudesListViewComponent,
    SolicitudListItemComponent,
    RechazoInfoComponent,
  ],
  exports: [
    SolicitudCardComponent,
    AutorizacionCardComponent,
    SolicitudPanelComponent,
    AutorizacionPanelComponent,
    SolicitudDetailComponent,
    SolicitudDetailModalComponent,
    SolicitudesListViewComponent,
    SolicitudListItemComponent,
    RechazoInfoComponent,
  ],
})
export class SharedUiSolicitudesModule {}
