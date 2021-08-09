import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ClienteSelectorComponent } from './cliente-selector/cliente-selector.component';
import { ClienteSelectorFieldComponent } from './cliente-selector-field/cliente-selector-field.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ClienteSelectorComponent, ClienteSelectorFieldComponent],
  exports: [ClienteSelectorComponent, ClienteSelectorFieldComponent],
})
export class SharedUiClientesModule {}
