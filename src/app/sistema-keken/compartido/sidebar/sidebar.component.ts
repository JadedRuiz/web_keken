import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  public menuItems = Array();
  public isCollapsed = true;
  foto_empresa = window.localStorage.getItem("url_empresa");
  foto_user = window.localStorage.getItem("url_foto");
  id_perfil = window.localStorage.getItem("id_perfil");
  catalogos : any;
  procesos : any;
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");

  constructor(
    private router: Router,
    public usuario: UsuarioService
    ) { }

  ngOnInit() {
    this.pintarMenu();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  pintarMenu(){
    this.catalogos = [];
    this.procesos = [];
    if(this.id_perfil == "1"){  //SuperAdmin
      this.catalogos  = [
        {path: 'usuarios', title: 'Usuarios', icon: 'ni-circle-08  text-orange'},
        {path: 'empresas', title: 'Empresas', icon: 'far fa-building text-orange'},
        {path: 'relacion_laboral', title: 'Relación laboral', icon: 'fas fa-portrait text-orange'},
        {path: 'demanda_laboral', title: 'Demanda laboral', icon: 'fas fa-book text-orange'}
      ];
      this.procesos = [
        {path: 'procedimiento_usuario', title: 'Asignar permisos a usuario', icon: 'ni-badge text-yellow'}
      ]
    }
    this.menuItems = [
      { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-red', id:"dashboard_header", band: false, tipo : ""},
      { path: '#', title: 'Catálogos',  icon:'ni-collection text-orange', id:"rh_header", band: true, tipo : "collapse",
        submenu : this.catalogos
      },
      { path: '#', title: 'Procedimientos', icon: 'ni-settings text-yellow', id:'rh_procesos', band: true, tipo : "collapse",
        submenu : this.procesos
      },
      { path: '#', title: 'Reportes', icon: 'ni-books text-green', id:'rh_reportes', band: false, tipo : ""}
    ];
  }
}
