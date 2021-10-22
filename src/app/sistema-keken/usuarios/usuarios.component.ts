import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import * as $ from 'jquery';
import { AlertifyService } from 'src/app/services/Alerta/Alertify.service';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { EmpresaService } from 'src/app/services/Empresa/Empresa.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  public usuario_creacion = parseInt(window.localStorage.getItem("id_usuario")+"");
  public url_foto = "../../../assets/img/defaults/image-default.png";
  public usuario = new Usuario(0,0,0,"","","",this.url_foto,this.usuario_creacion);
  public id_perfil = parseInt(window.localStorage.getItem("id_perfil")+"");
  public usuarios = new Array<Usuario>();
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public color  = "bg-gray";
  public perfiles : any;
  public empresas : any;
  //Paginación
  public total_registros = 0;
  public mostrar_pagination = false;
  public paginas_a_mostrar = 5;
  public paginas : any;
  public pagina_actual = 0;
  public limite_inferior = 0;
  public limite_superior = this.paginas_a_mostrar;
  public next = false;
  public previous = false;
  public taken = 5;

  constructor(
    public modalService : NgbModal,
    private compartido : CompartidoService,
    private alerta_service : AlertifyService,
    private usuario_service : UsuarioService,
    private empresa_service : EmpresaService
  ) { }

  ngOnInit(): void {
    this.mostrarUsuarios();
  }

  mostrarUsuarios(){
    this.usuarios = [];
  }

  nuevoUsuario(){
    this.limpiarCampos();
    this.mostrarPerfiles();
    this.mostrarEmpresas();
    this.openModal(this.contenidoDelModal);
  }

  mostrarPerfiles(){
    this.perfiles = [];
    this.compartido.obtenerPerfiles()
    .subscribe((object : any) => {
      if(object.ok){
        this.perfiles = object.data;
      }
    });
  }

  mostrarEmpresas(){
    this.empresas = [];
    this.empresa_service.obtenerEmpresas()
    .subscribe((object : any) => {
      if(object.length > 0){
        this.empresas = object;
      }
    });
  }

  setearPerfil(id : any){
    $(".listItem").removeClass("active");
    $("#list"+id).addClass("active");
    this.usuario.id_perfil = id;
  }

  guardarUsuario(){
    if(this.usuario.nombre == ""){
      this.alerta_service.error("El nombre no puede estar vacio");
      return;
    }
    if(this.usuario.usuario == ""){
      this.alerta_service.error("El usuario no puede estar vacio");
      return;
    }
    if(this.usuario.password == ""){
      this.alerta_service.error("La contraseña no puede estar vacio");
      return;
    }
    if(this.id_perfil == 1 && this.usuario.id_empresa == 0){
      this.alerta_service.error("Debes seleccionarle una empresa al usuario");
      return;
    }else{
      this.usuario.id_empresa = parseInt(window.localStorage.getItem("id_empresa")+"");
    }
    if(this.usuario.avatar == this.url_foto){
      this.usuario.avatar = "";
    }
    if(this.usuario.id_perfil == 0){
      this.alerta_service.error("Debes seleccionarle un perfil al usuario");
      return;
    }
    //Aquí cae si el formulario esta bien llenado
    this.confirmar("Confirmación","¿Seguro que deseas guardar el usuario?","info",1,null);
    this.usuario.avatar = this.url_foto;
  }

  paginar(){
    this.paginas = [];
    let paginas_a_pintar = parseInt(this.total_registros+"")%parseInt(this.taken+"");
    if(paginas_a_pintar == 0){
      paginas_a_pintar = (parseInt(this.total_registros+"")-paginas_a_pintar)/parseInt(this.taken+"");
    }else{
      paginas_a_pintar = ((parseInt(this.total_registros+"")-paginas_a_pintar)/parseInt(this.taken+""))+1;
    }
    //Pintamos las flechas
    if(paginas_a_pintar > this.paginas_a_mostrar){
      this.next = true;
    }
    if(this.pagina_actual == paginas_a_pintar){
      this.next = false;
    }
    if(this.pagina_actual > this.paginas_a_mostrar){
      this.previous = true;
    }
    if(this.pagina_actual == 0){
      this.previous = false;
    }
    //Pintamos las paginas
    for(let i =0;i<this.paginas_a_mostrar;i++){
      let pagina_inicial = this.limite_inferior;
      if(i<paginas_a_pintar){
        if(this.pagina_actual == pagina_inicial+i){
          this.paginas.push({
            numero : (pagina_inicial+i)+1,
            valor_pagina : pagina_inicial+i,
            active : "active"
          });
        }else{
          this.paginas.push({
            numero : (pagina_inicial+i)+1,
            valor_pagina : pagina_inicial+i,
            active : ""
          });
        }
      }
    }
  }

  irPagina(pagina : any){
    this.pagina_actual = pagina;
    this.mostrarUsuarios();
  }

  openModal(longContent : any) {
    this.modalService.open(longContent, { scrollable: true, size: 'lg', centered: true });
  }

  changeStyle($event : any){
    this.color = $event.type == 'mouseover' ? 'btn-info' : 'bg-gray';
  }

  limpiarCampos(){
    $(".listItem").removeClass("active");
    this.usuario = new Usuario(0,0,0,"","","","../../../assets/img/defaults/image-default.png",this.usuario_creacion);
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number, data : any){
    Swal.fire({
      title: title,
      text: texto,
      icon: tipo_alert,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        if(tipo == 1){  //Crear usuario nuevo
          this.usuario_service.altaUsuario(this.usuario)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha guardado existosamente","success");
            }
          })
        }
      }
    });
  }

}
