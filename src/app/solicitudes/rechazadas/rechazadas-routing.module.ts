import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RechazadasPage } from './rechazadas.page';

const routes: Routes = [
  {
    path: '',
    component: RechazadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechazadasPageRoutingModule {}
