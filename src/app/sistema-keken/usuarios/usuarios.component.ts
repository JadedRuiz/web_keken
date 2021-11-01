import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import * as $ from 'jquery';
import { AlertifyService } from 'src/app/services/Alerta/Alertify.service';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { EmpresaService } from 'src/app/services/Empresa/Empresa.service';
import { SucursalService } from 'src/app/services/Sistema_RL/Sucursal.service';
import { DespachoService } from 'src/app/services/Sistema_RL/Despacho.service';
import { DomSanitizer } from '@angular/platform-browser';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public usuario_creacion = parseInt(window.localStorage.getItem("id_usuario")+"");
  public url_foto : any;
  id_empresa = 1;
  public usuario = new Usuario(0,this.id_empresa,0,"","","","","",this.usuario_creacion,0);
  public id_perfil = parseInt(window.localStorage.getItem("id_perfil")+"");
  public usuarios : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('modal_camera', {static: false}) modaCamera : any;
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
  public valores : any;
  opcion = {
    nombre : "Opcion",
    valores : Array(),
    band : true
  };
  @ViewChild('modal_camera', {static: false}) modalCamera : any;
  camera : any;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public tipo_modal = 1;

  constructor(
    public modalService : NgbModal,
    private compartido : CompartidoService,
    private alerta_service : AlertifyService,
    private usuario_service : UsuarioService,
    private empresa_service : EmpresaService,
    private sucursal_service : SucursalService,
    private despacho_service : DespachoService,
    private sanitizer: DomSanitizer
  ) {
    this.url_foto = "../../../assets/img/defaults/image-default.png";
   }

  ngOnInit(): void {
    this.mostrarUsuarios();
  }

  mostrarUsuarios(){
    this.usuarios = [];
    this.usuario_service.obtenerUsuarios(this.id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.usuarios = object.data;
      }
    });
  }

  nuevoUsuario(){
    this.limpiarCampos();
    this.tipo_modal = 1;
    this.mostrarPerfiles();
    this.mostrarEmpresas();
    this.openModal(this.contenidoDelModal,'md');
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

  mostrarOpciones(){
    this.opcion.valores = [];
    if(this.usuario.id_perfil != 0){
      if(this.usuario.id_perfil == 3 || this.usuario.id_perfil == 4){
        this.opcion.band = false;
        this.opcion.nombre = "Selecciona la sucursal";
        this.sucursal_service.obtenerSucursales(this.usuario.id_empresa)
        .subscribe((object : any) => {
          if(object.ok){
            object.data.forEach((element : any) =>{
              this.opcion.valores.push({
                id : element.id_sucursal,
                nombre : element.sucursal
              });
            });
            this.opcion.valores;
          }else{
            this.opcion.valores.push({
              nombre : "No se tiene configurado sucurles",
              id : 0
            });
          }
        });
        return;
      }
      if(this.usuario.id_perfil == 5){
        this.opcion.nombre = "Selecciona el despacho";
        this.opcion.band = false;
        this.despacho_service.obtenerDespachos(this.usuario.id_empresa)
        .subscribe((object : any) => {
          if(object.ok){
            object.data.forEach((element : any) =>{
              this.opcion.valores.push({
                id : element.id_despacho,
                nombre : element.despacho
              });
            });
            this.opcion.valores;
          }else{
            this.opcion.valores.push({
              nombre : "No se tiene configurado despachos",
              id : 0
            });
          }
        });
        return;
      }
      this.opcion.nombre = "Opción";
      this.opcion.band = true;
    }
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
  }

  editar(id : any){
    this.limpiarCampos();
    this.tipo_modal = 2;
    this.mostrarPerfiles();
    this.mostrarEmpresas();
    this.usuario_service.obtenerUsuarioPorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.usuario.id_usuario = id;
        this.usuario.id_empresa = object.data.id_empresa;
        this.url_foto = object.data.avatar;
        this.usuario.id_perfil = object.data.id_perfil;
        this.usuario.usuario = object.data.usuario;
        this.usuario.nombre = object.data.nombre;
        this.usuario.password = object.data.contra;
        this.usuario.avatar = this.url_foto;
        if(this.usuario.id_perfil == 3 || this.usuario.id_perfil == 4 || this.usuario.id_perfil == 5){
          this.usuario.id_opcion = object.data.id_opcion;
        }
        this.mostrarOpciones();
        this.openModal(this.contenidoDelModal,'md');
      }
    });
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

  openModal(longContent : any, size : string) {
    return this.modalService.open(longContent, { scrollable: true, size: size, centered: true });
  }

  changeStyle($event : any){
    this.color = $event.type == 'mouseover' ? 'btn-info' : 'bg-gray';
  }

  limpiarCampos(){
    this.url_foto = "../../../assets/img/defaults/image-default.png";
    this.usuario = new Usuario(0,this.id_empresa,0,"","","","","",this.usuario_creacion,0);
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

  //FOTOGRAFIA
  tomarFoto(){
    this.camera = this.openModal(this.modalCamera, 'md');
  }

  subirImagen(){
    document.getElementById("foto_user")?.click();
  }

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      this.usuario.extension = extension;
      if(extension == "jpg" || extension == "png"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          this.usuario.avatar = respuesta+"";
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.url_foto = this.sanitizer.bypassSecurityTrustResourceUrl(img);
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
  }
  
  convertirImagenAB64(fileInput : any){
    return new Promise(function(resolve, reject) {
      let b64 = "";
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);
      reader.onload = (e: any) => {
          b64 = e.target.result.split("base64,")[1];
          resolve(b64);
      };
    });
  }

  takeSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    this.url_foto = webcamImage.imageAsDataUrl;
    let docB64 = this.url_foto.split(",");
    this.usuario.avatar = docB64[1];
    this.usuario.extension = "jpeg";
    this.camera.close();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
