import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechazadasPageRoutingModule } from './rechazadas-routing.module';

import { RechazadasPage } from './rechazadas.page';
import { RechazadasListComponent } from './list-view/rechazadas-list.component';
import { RechazadaItemComponent } from './list-view/rechazada-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RechazadasPageRoutingModule,
  ],
  declarations: [
    RechazadasPage,
    RechazadasListComponent,
    RechazadaItemComponent,
  ],
})
export class RechazadasPageModule {}
