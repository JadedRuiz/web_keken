import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SistemaRlRoutingModule } from './sistema_rl.routing';
import { CompartidoModule } from './compartido/compartido.module';
import { InicioComponent } from './inicio/inicio.component';
import { SistemaRlComponent } from './sistema_rl.compononent';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TerminacionLaboralComponent } from './terminacion_laboral/terminacion_laboral.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { WebcamModule } from 'ngx-webcam';
import { DemandasComponent } from './demandas/demandas.component';


@NgModule({
  declarations: [
    SistemaRlComponent,
    InicioComponent,
    UsuariosComponent,
    EmpresasComponent,
    DashboardComponent,
    TerminacionLaboralComponent,
    DemandasComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    SistemaRlRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    NgbModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatCardModule,
    MatTabsModule,
    WebcamModule
  ],
  bootstrap : [SistemaRlComponent]
})
export class SistemaRlModule { }
