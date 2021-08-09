import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AutorizadasPage } from './autorizadas.page';
import { AutorizadasListComponent } from './autorizadas-list/autorizadas-list.component';
import { SharedFiltersModule } from '@papx/shared/filters/shared-filters.module';

import { SharedUiClientesModule } from '@papx/shared/ui-clientes';

const routes: Routes = [
  {
    path: '',
    component: AutorizadasPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiClientesModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedFiltersModule,
  ],
  declarations: [AutorizadasPage, AutorizadasListComponent],
})
export class AutorizadasPageModule {}
