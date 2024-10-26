import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciasPageRoutingModule } from './asistencias-routing.module';

import { AsistenciasPage } from './asistencias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciasPageRoutingModule
  ],
  declarations: [AsistenciasPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AsistenciasPageModule {}
