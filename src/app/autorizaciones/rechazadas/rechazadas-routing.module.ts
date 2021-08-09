import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RechazadaPage } from './rechazada/rechazada.page';

import { RechazadasPage } from './rechazadas.page';

const routes: Routes = [
  {
    path: '',
    component: RechazadasPage,
  },
  {
    path: ':id',
    component: RechazadaPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechazadasPageRoutingModule {}
