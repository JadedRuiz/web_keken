import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Demanda } from 'src/app/models/Demanda';
import { EmpresaService } from 'src/app/services/Empresa/Empresa.service';
import { AudienciaService } from 'src/app/services/Sistema_RL/Audiencia.service';
import { DemandaService } from 'src/app/services/Sistema_RL/Demanda.service';
import { DespachoService } from 'src/app/services/Sistema_RL/Despacho.service';
import { DocumentoService } from 'src/app/services/Sistema_RL/Documento.service';
import { RelacionLaboralService } from 'src/app/services/Sistema_RL/RelacionLaboral.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-demandas',
  templateUrl: './demandas.component.html',
  styleUrls: ['./demandas.component.css']
})
export class DemandasComponent implements OnInit {
  
  //Variables
  id_sucursal = 1;
  id_empresa = 1;
  id_usuario = 1;
  modal : any;
  autocomplete : any;
  relaciones : any;
  despachos : any;
  documentos : any;
  demandas : any;
  demanda = new Demanda(0,0,"","","","",0,0,"",this.id_usuario,true,[],[]);
  buscador = "";
  relacion = "";
  myControl = new FormControl();
  myControlDos = new FormControl();
  audiencia = {
    id_demanda : 0,
    id_audiencia : 0,
    fecha_oficio : "",
    fecha_recepcion : "",
    fecha_audiencia : "",
    fecha_mostrar : "",
    documento : "",
    extension : "",
    observacion : ""
  }
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('modal_pdf', {static: false}) modal_pdf : any;
  url_doc : any;
  tipo_modal = 1;

  constructor(
    public modalService : NgbModal,
    private relacion_service : RelacionLaboralService,
    private sanitizer: DomSanitizer,
    private demanda_service : DemandaService,
    private despacho_service : DespachoService,
    private documento_service : DocumentoService,
    private audiencia_service : AudienciaService
    ) { }

  ngOnInit(): void {
    this.mostrarDemandas();
  }

  mostrarDemandas(){
    this.demandas = [];
    this.demanda_service.obtenerDemandas(this.id_sucursal)
    .subscribe((object : any) => {
      if(object.ok){
        this.demandas = object.data;
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

  mostrarDocs(tipo : number, arreglo : any){
    if(tipo == 1){
      this.documentos = [];
      this.documento_service.obtenerDocumentosDemandaConfigurados(this.id_empresa)
      .subscribe((object : any) => {
        if(object.ok){
          object.data.forEach((element : any) => {
            this.documentos.push({
              "id_documentoDigital" : element.id_documentoDigital,
              "nombre" : element.nombre,
              "descripcion" : element.descripcion,
              "obligatorio" : element.obligatorio,
              "documento" : "../../../assets/img/defaults/image-default.png",
              "documentoB64" : "",
              "extension" : "",
              "descarga" : false,
              "descarga_doc" : ""
            });
          });
        }
      });
    }
    if(tipo == 2){
      this.documentos.forEach((element : any) => {
        arreglo.forEach((documento : any) => {
            if(documento.id_documentoDigital == element.id_documentoDigital){
              element.descarga = true;
              if(documento.extension == "jpg" || documento.extension == "jpeg" || documento.extension == "png"){
                let img = "data:image/"+documento.extension+";base64, "+documento.documento;
                element.documento = this.sanitizer.bypassSecurityTrustResourceUrl(img);
                return;
              }
              if(documento.extension == "pdf"){
                element.documento = "../../../assets/img/defaults/pdf_default.png";
                return;
              }
              element.documento = "../../../assets/img/defaults/archivo_default.png";
            }
        });
      });
    }
    
  }

  abrirAlta(){
    this.mostrarDespachos();
    this.mostrarDocs(1,null);
    this.tipo_modal = 1;
    this.modal = this.openModal(this.contenidoDelModal,'lg');
  }

  buscar(){

  }

  autoComplete(value : any){
    this.autocomplete = [];
  }

  autoCompleteRelacion(value : any){
    if(value.length > 0){
      this.relaciones = [];
      let json = {
        id_sucursal : this.id_sucursal,
        palabra : value
      }
      this.relacion_service.buscador(json)
      .subscribe((object : any) => {
        this.relaciones = object.data.busqueda;
      });
    }
  }

  agregarAudiencia(){
    //Validaciones
    if(this.audiencia.fecha_audiencia == ""){
      Swal.fire("Ha ocurrido un error","No se puede agregar una audiencia, sin antes agregar la fecha de la misma","error");
      return;
    }
    let fecha_hora = new Date(this.audiencia.fecha_audiencia);
    let dia = fecha_hora.getDate();
    let mes = (fecha_hora.getMonth()+1);
    let mes_completo = this.getMes(mes+"");
    let año = fecha_hora.getFullYear();
    let hora_tiempo = this.getHora(fecha_hora.getHours()+"");
    let minituos = fecha_hora.getMinutes();
    this.audiencia.fecha_mostrar = "Audiencia programada para el día "+dia+" de "+mes_completo+" del "+año+" a las "+hora_tiempo.hora+":"+minituos+" "+hora_tiempo.tiempo; 
    this.demanda.audiencias.push({
      id_audiencia : (this.demanda.audiencias.length +1),
      fecha_oficio : this.audiencia.fecha_oficio,
      fecha_recepcion : this.audiencia.fecha_recepcion,
      fecha_audiencia : this.audiencia.fecha_audiencia,
      fecha_mostrar : this.audiencia.fecha_mostrar,
      documento : this.audiencia.documento,
      extension : this.audiencia.extension,
      observacion : this.audiencia.observacion
    });
    this.audiencia = {
      id_demanda : 0,
      id_audiencia : 0,
      fecha_oficio : "",
      fecha_recepcion : "",
      fecha_audiencia : "",
      fecha_mostrar : "",
      documento : "",
      extension : "",
      observacion : ""
    };
  }

  altaAudiencia(){
    let fecha_hora = new Date(this.audiencia.fecha_audiencia);
    let dia = fecha_hora.getDate();
    let mes = (fecha_hora.getMonth()+1);
    let mes_completo = this.getMes(mes+"");
    let año = fecha_hora.getFullYear();
    let hora_tiempo = this.getHora(fecha_hora.getHours()+"");
    let minituos = fecha_hora.getMinutes();
    this.audiencia.fecha_mostrar = "Audiencia programada para el día "+dia+" de "+mes_completo+" del "+año+" a las "+hora_tiempo.hora+":"+minituos+" "+hora_tiempo.tiempo;
    this.audiencia.id_demanda = this.demanda.id_demanda;
    this.audiencia_service.altaAudiencia(this.audiencia)
    .subscribe((object : any) => {
      if(object.ok){
        this.demanda.audiencias.push({
          id_audiencia : object.data,
          fecha_oficio : this.audiencia.fecha_oficio,
          fecha_recepcion : this.audiencia.fecha_recepcion,
          fecha_audiencia : this.audiencia.fecha_audiencia,
          fecha_mostrar : this.audiencia.fecha_mostrar,
          documento : this.audiencia.documento,
          extension : this.audiencia.extension,
          observacion : this.audiencia.observacion
        });
        this.audiencia = {
          id_demanda : 0,
          id_audiencia : 0,
          fecha_oficio : "",
          fecha_recepcion : "",
          fecha_audiencia : "",
          fecha_mostrar : "",
          documento : "",
          extension : "",
          observacion : ""
        };
      }
    }); 
  }

  altaDemanda(){
    this.demanda.documentos = [];
    let band = true;
    this.documentos.forEach((documento : any) => {
      if(documento.obligatorio == "1"){
        if(documento.documentoB64 == ""){
          band = false;
          Swal.fire("Ha ocurrido un error","El documento " + documento.nombre +" es obligatorio","error");
        }else{
          this.demanda.documentos.push({
            id_documentoDigital : documento.id_documentoDigital,
            documento : documento.documentoB64,
            extension : documento.extension
          });
        }
      }else{
        if(documento.documentoB64 != ""){
          this.demanda.documentos.push({
            id_documentoDigital : documento.id_documentoDigital,
            documento : documento.documentoB64,
            extension : documento.extension
          });
        }
      }
    });
    if(band){
      this.confirmar("Confirmación","¿Seguro que deseas dar de alta esta demanda?","info",null,1);
    }
  }

  editar(id : number){
    this.limpiar();
    this.mostrarDocs(1,null);
    this.mostrarDespachos();
    this.tipo_modal = 2;
    this.demanda_service.obtenerDemandaPorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.myControlDos.setValue(object.data.nombre);
        this.demanda.id_demanda = id;
        this.demanda.id_RelacionLaboral = object.data.id_RelacionLaboral;
        this.demanda.abogado_demandante = object.data.nombre_abogadoDemandante;
        this.demanda.correo_demandante = object.data.correo_abogadoDemandante;
        this.demanda.telefono_demandante = object.data.telefono_abogadoDemandante;
        this.demanda.tipo_riesgo = object.data.tipo_riesgo;
        this.demanda.id_catDespacho = object.data.id_catDespacho;
        this.demanda.id_estatus = object.data.id_estatus;
        this.demanda.abogado_cargo = object.data.nombre_abogadoAtendio;
        //Audiencias
        object.data.audiencias.forEach((audiencia : any) => {
          let fecha_hora = new Date(audiencia.fecha_audiencia);
          let dia = fecha_hora.getDate();
          let mes = (fecha_hora.getMonth()+1);
          let mes_completo = this.getMes(mes+"");
          let año = fecha_hora.getFullYear();
          let hora_tiempo = fecha_hora.getHours();
          let minituos = fecha_hora.getMinutes();
          let fecha_mostrar = "Audiencia programada para el día "+dia+" de "+mes_completo+" del "+año+" a las "+hora_tiempo+":"+minituos; 
          this.demanda.audiencias.push({
            id_audiencia : audiencia.id_audiencia,
            fecha_oficio : "",
            fecha_recepcion : "",
            fecha_audiencia : audiencia.fecha_audiencia,
            fecha_mostrar : fecha_mostrar,
            documento : audiencia.documento,
            extension : audiencia.extension,
            observacion : audiencia.observaciones
          });
          //Documentos
          this.mostrarDocs(2,object.data.documentos);
        });
      }
    });
    this.modal = this.openModal(this.contenidoDelModal,'lg');
  }

  modificarDemanda(){
    this.demanda.documentos = [];
    this.documentos.forEach((documento : any) => {
      if(documento.obligatorio == "1"){
        if(documento.documentoB64 != ""){
          this.demanda.documentos.push({
            id_documentoDigital : documento.id_documentoDigital,
            documento : documento.documentoB64,
            extension : documento.extension
          });
        }
      }else{
        if(documento.documentoB64 != ""){
          this.demanda.documentos.push({
            id_documentoDigital : documento.id_documentoDigital,
            documento : documento.documentoB64,
            extension : documento.extension
          });
        }
      }
    });
    this.confirmar("Confirmación","¿Seguro deseas modificar está demanda?","info",null,2);
  }

  limpiar(){
    this.demanda = new Demanda(0,0,"","","","",0,0,"",this.id_usuario,true,[],[]);
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
        if(tipo == 1){  //Guardar
          this.demanda_service.altaDemanda(this.demanda)
          .subscribe((object : any) => {
            if(object.ok){
              this.modal.close();
              this.mostrarDemandas();
              Swal.fire("Buen trabajo","La demanda ha sido creada con exito","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Modificar
          this.demanda_service.modificarDemanda(this.demanda)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarDemandas();
              Swal.fire("Buen trabajo","La demanda ha sido modificada con exito","success");
            }
          });
        }
      }
    });
  }

  subirDocumentoDos(id : number){
    document.getElementById("adjunta"+id)?.click();
  }

  cambiarDocumento(event : any, id : number){
    this.documentos.forEach((documento : any) => {
      if(documento.id_documentoDigital == id){
        if (event.target.files && event.target.files[0]) {
          let archivo = event.target.files[0];
          let extension = archivo.name.split(".")[1];
          documento.extension = extension;
          if(extension == "jpg" || extension == "png" || extension == "jpeg"){
            this.convertirImagenAB64(archivo).then( respuesta => {
              let img = "data:image/"+extension+";base64, "+respuesta;
              documento.documento = this.sanitizer.bypassSecurityTrustResourceUrl(img);
              documento.documentoB64 = respuesta;
            });
            return;
          }
          if(extension == "pdf"){
            documento.documento = "../../../assets/img/defaults/pdf_default.png";
            this.convertirImagenAB64(archivo).then( respuesta => {
              documento.documentoB64 = respuesta;
            });
            return;
          }
          //Otro tipo de documento
            documento.documento = "../../../assets/img/defaults/archivo_default.png";
            this.convertirImagenAB64(archivo).then( respuesta => {
              documento.documentoB64 = respuesta;
            });
        }
      }
    });
  }

  descarga(id_documentoDigital : number){
    // this.documento_service.obtenerDocumentoRelacion(this.relacionLaboral.id_RelacionLaboral,id_documentoDigital)
    // .subscribe((object : any) => {
    //     if(object.ok){
    //       var arrayBuffer = this.base64ToArrayBuffer(object.data.documento);
    //       var newBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });
    //       var data = window.URL.createObjectURL(newBlob);
    //       let link  = document.createElement('a');
    //       link.href = data;
    //       link.download = object.data.documentoDigital.replace(" ","")+"."+object.data.extension;
    //       link.click();
    //     }
    // })
  }

  base64ToArrayBuffer(base64 : string) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  getMes(mes : string){
    switch(mes){
      case '1' : return 'Enero';
      case '2' : return 'Febrero';
      case '3' : return 'Marzo';
      case '4' : return 'Abril';
      case '5' : return 'Mayo';
      case '6' : return 'Junio';
      case '7' : return 'Julio';
      case '8' : return 'Agosto';
      case '9' : return 'Septiembre';
      case '10' : return 'Octubre';
      case '11' : return 'Noviembre';
      case '12' : return 'Enero';
    }
    return "";
  }

  getHora(hora : string){
    let dato = {
      "hora" : "",
      "tiempo" : ""
    };
    switch(hora){
      case '01' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '02' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '03' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '04' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '05' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '06' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '07' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '08' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '09' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '10' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '11' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '12' : dato.hora = hora; dato.tiempo = "A.M"; break;
      case '13' : dato.hora = "1"; dato.tiempo = "P.M"; break;
      case '14' : dato.hora = "2"; dato.tiempo = "P.M"; break;
      case '15' : dato.hora = "3"; dato.tiempo = "P.M"; break;
      case '16' : dato.hora = "4"; dato.tiempo = "P.M"; break;
      case '17' : dato.hora = "5"; dato.tiempo = "P.M"; break;
      case '18' : dato.hora = "6"; dato.tiempo = "P.M"; break;
      case '19' : dato.hora = "7"; dato.tiempo = "P.M"; break;
      case '20' : dato.hora = "8"; dato.tiempo = "P.M"; break;
      case '21' : dato.hora = "9"; dato.tiempo = "P.M"; break;
      case '22' : dato.hora = "10"; dato.tiempo = "P.M"; break;
      case '23' : dato.hora = "11"; dato.tiempo = "P.M"; break;
      case '24' : dato.hora = "12"; dato.tiempo = "P.M"; break;
    }
    return dato;
  }

  selectRelacion(event : any){
    this.demanda.id_RelacionLaboral = parseInt(event.option.id+"");
  }

  subirDocumento(id : string){
    document.getElementById(id)?.click();
  }

  cambiarDoc(event : any){
    if (event.target.files && event.target.files[0]) {
      let archivo = event.target.files[0];
      let extension = archivo.name.split(".")[1];
      this.audiencia.extension = extension;
      if(extension == "pdf"){
        this.convertirImagenAB64(archivo).then( respuesta => {
          this.audiencia.documento = respuesta+"";
        });
      }else{
        Swal.fire("Ha ocurrido un error","Solo se aceptan documentos PDF","error");
      }
    }
  }

  visualizarPDF(id : number){
    this.demanda.audiencias.forEach((audiencia : any) => {
      if(audiencia.id_audiencia == id){
        this.url_doc = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64, "+audiencia.documento);
      }
    });
    this.openModal(this.modal_pdf,'lg');
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

  openModal(longContent : any, size : any) {
    return this.modalService.open(longContent, { scrollable: true, size: size, centered: true, backdrop: 'static', keyboard: false });
  }
}
