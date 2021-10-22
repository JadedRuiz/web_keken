import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  public nombre_user = window.localStorage.getItem("nombre");
  public url_foto = window.localStorage.getItem("url_foto");

  constructor() { }

  ngOnInit(): void {
  }
  recuperarEmpresas(){
    
  }
  eleccion(id_empresa : any){
   
  }
  openModal() {
    
  }
  closeModal(){
    
  }
  cerrarSesion(){
    window.localStorage.removeItem("id_usuario");
    window.localStorage.removeItem("id_empresa");
    window.localStorage.removeItem("id_perfil");
    window.localStorage.removeItem("nombre");
    window.localStorage.removeItem("url_empresa");
    window.localStorage.removeItem("url_foto");
    location.reload();
  }
}
