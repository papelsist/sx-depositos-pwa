import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutotirzacionesTabPage } from './autotirzaciones-tab.page';
import { SolicitudAutorizadaResolver } from '@papx/data-access';

const routes: Routes = [
  {
    path: '',
    component: AutotirzacionesTabPage,
    children: [
      {
        path: 'pendientes',
        loadChildren: () =>
          import('../pendientes/pendientes.module').then(
            (m) => m.PendientesPageModule
          ),
      },
      {
        path: 'autorizadas',
        loadChildren: () =>
          import('../autorizadas/autorizadas.module').then(
            (m) => m.AutorizadasPageModule
          ),
      },

      {
        path: 'rechazadas',
        loadChildren: () =>
          import('../rechazadas/rechazadas.module').then(
            (m) => m.RechazadasPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'pendientes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'autorizadas/:id',
    loadChildren: () =>
      import('../aurorizada/aurorizada.module').then(
        (m) => m.AurorizadaPageModule
      ),
    resolve: {
      // solicitud: SolicitudAutorizadaResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutotirzacionesTabPageRoutingModule {}
