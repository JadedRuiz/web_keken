import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Despacho } from 'src/app/models/Despacho';
import { Empresa } from 'src/app/models/Empresa';
import { Sucursal } from 'src/app/models/Sucursal';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { EmpresaService } from 'src/app/services/Empresa/Empresa.service';
import { DespachoService } from 'src/app/services/Sistema_RL/Despacho.service';
import { SucursalService } from 'src/app/services/Sistema_RL/Sucursal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public var_modal : any;
  color  = "bg-gray";
  public estados : any;
  public sucursales : any;
  public despachos : any;
  public estados_copy : any;
  public url_foto : any;
  @ViewChild('content', { static : false}) modal : any;
  public id_empresa = 1;
  public empresa = new Empresa(this.id_empresa,0,"","","","","","","");
  public sucursal = new Sucursal(0,0,0,this.id_empresa,"","","","","");
  public despacho = new Despacho(0,this.id_empresa,"","","","","");
  public tipo_modal = 0;

  constructor(
    private modal_service : NgbModal,
    private sanitizer: DomSanitizer,
    private compartido_serv : CompartidoService,
    private empresa_service : EmpresaService,
    private sucursal_service : SucursalService,
    private despacho_service : DespachoService
  ) { 
    this.url_foto = "../../../../assets/img/defaults/image-default.png";
  }

  ngOnInit(): void {
    this.mostrarDatosEmpresa();
    this.mostrarSucursales();
    this.mostrarDespachos();
  }

  mostrarDatosEmpresa(){
    this.empresa_service.obtenerEmpresaPorId(this.id_empresa+"")
    .subscribe((object : any) => {
      if(object.ok){
        this.url_foto = object.data.url_foto;
        this.empresa.razon_social = object.data.razon_social;
        this.empresa.curp = object.data.curp;
        this.empresa.rfc = object.data.rfc;
        this.empresa.representante = object.data.representante;
      }
    });
  }

  mostrarSucursales(){
    this.sucursales = [];
    this.sucursal_service.obtenerSucursales(this.id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.sucursales = object.data;
      }
    });
  }

  mostrarDespachos(){
    this.despachos = [];
    this.despacho_service.obtenerDespachos(this.id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.despachos = object.data;
      }
    });
  }

  editarEmpresa(){
    this.confirmar("Confirmación","¿Seguro que deseas editar los datos de tu empresa?","info",null,3);
  }

  nuevaSucursal(){
    this.var_modal = this.openModal(this.modal,'md'); 
    this.tipo_modal = 1;
    this.obtenerCatalogo('rl_catestados');
  }

  altaSucursal(){
    this.confirmar("Confirmación","¿Seguro que deseas dar de alta está sucursal?","info",null,1);
  }

  nuevoDespacho(){
    this.tipo_modal = 2;
    this.var_modal = this.openModal(this.modal,'md'); 
  }

  altaDespacho(){
    this.confirmar("Confirmación","¿Seguro que deseas dar de alta este despacho?","info",null,2);
  }

  obtenerCatalogo(nombre_tabla : any){
    this.compartido_serv.obtenerCatalogo(nombre_tabla)
    .subscribe((object : any) => {
      if(object.length >0){
        this.estados = object;
        this.estados_copy = object;
      }
    });
  }

  autocomplete(value : string){
    this.estados = [];
    this.estados_copy.forEach((element : any) => {
      this.estados.push({
        "id_estado" : element.id_estado,
        "estado" : element.estado
      });
    });
    if(value.length > 0){
      this.estados = [];
      this.estados_copy.forEach((element : any) => {
        if(element.estado.includes(value.toUpperCase())){ 
          this.estados.push({
            "id_estado" : element.id_estado,
            "estado" : element.estado
          })
        }
      });
    }
  }

  setIdEstado(event : any){
    this.sucursal.id_estado = event.option.id;
  }

  subirImagen(){
    document.getElementById("foto_user")?.click();
  }

  changeStyle($event : any){
    this.color = $event.type == 'mouseover' ? 'btn-info' : 'bg-gray';
  }

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      if(extension == "jpg" || extension == "png"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.url_foto = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.empresa.foto = respuesta+"";
          this.empresa.extension = extension;
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

  openModal(modal : any, size : string){
    return this.modal_service.open(modal, { scrollable: true, size: size, centered: true, backdrop: 'static', keyboard: false });
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,json : any,tipo : number){
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
        if(tipo == 1){  //Alta sucursal
          this.sucursal_service.altaSucursal(this.sucursal)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarSucursales();
              this.modal.close();
              Swal.fire("Buen trabajo","La sucursal se ha dado de alta","success");
            }else{
              Swal.fire("Ha ocurruido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Alta despacho
          this.despacho_service.altaDespacho(this.despacho)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarDespachos();
              this.modal.close();
              Swal.fire("Buen trabajo","El despacho se ha dado de alta","success");
            }else{
              Swal.fire("Ha ocurruido un error",object.message,"error");
            }
          });
        }
        if(tipo == 3){  //Modificar empresa
          this.empresa_service.modificarEmpresa(this.empresa)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo",object.data,"success");
            }
          });
        }
      }
    });
  }

}
