import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditSolicitudPage } from './edit-solicitud.page';
import { ExistsSolicitudGuard } from './exist-solicitud.guard';
import { SolicitudEditFormComponent } from './solicitud-edit-form/solicitud-edit-form.component';
import { SharedUiSolicitudesModule } from '@papx/shared/ui-solicitudes';
import { SharedUiBancosModule } from '@papx/shared/ui-bancos';
import { SharedUiClientesModule } from '@papx/shared/ui-clientes';

const routes: Routes = [
  {
    path: '',
    component: EditSolicitudPage,
    canActivate: [ExistsSolicitudGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedUiBancosModule,
    SharedUiClientesModule,
    SharedUiSolicitudesModule,
  ],
  declarations: [EditSolicitudPage, SolicitudEditFormComponent],
})
export class EditSolicitudPageModule {}
