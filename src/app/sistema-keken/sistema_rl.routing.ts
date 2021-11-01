import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuardGuard } from '../services/guard/login_guard.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DemandasComponent } from './demandas/demandas.component';
import { DespachoDemandaComponent } from './despacho-demanda/despacho-demanda.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { InicioComponent } from './inicio/inicio.component';
import { SistemaRlComponent } from './sistema_rl.compononent';
import { TerminacionLaboralComponent } from './terminacion_laboral/terminacion_laboral.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [{
  path : 'sistema_rl',
  component : SistemaRlComponent,
  canActivate: [ LoginGuardGuard ],
  children : [
  { path : "dashboard", component : DashboardComponent },
  { path : "inicio", component : InicioComponent },
  { path : "usuarios", component : UsuariosComponent },
  { path : "empresas", component : EmpresasComponent },
  { path : "relacion_laboral", component : TerminacionLaboralComponent },
  { path : "demanda_laboral", component : DemandasComponent },
  { path : "demanda_despacho", component : DespachoDemandaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRlRoutingModule { }
