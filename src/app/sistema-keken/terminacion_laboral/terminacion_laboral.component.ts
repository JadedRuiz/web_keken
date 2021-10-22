import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RelacionLaboral } from 'src/app/models/RelacionLaboral';
import { RelacionLaboralService } from 'src/app/services/Sistema_RL/RelacionLaboral.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { DocumentoService } from 'src/app/services/Sistema_RL/Documento.service';

@Component({
  selector: 'app-terminacion-laboral',
  templateUrl: './terminacion_laboral.component.html',
  styleUrls: ['./terminacion_laboral.component.css']
})
export class TerminacionLaboralComponent implements OnInit {

  //Variables
  myControl = new FormControl();
  id_sucursal = 1;
  id_empresa = 1;
  url_foto : any;
  buscador = "";
  autocomplete : any;
  color  = "bg-gray";
  selected = "";
  documentos : any;
  relacionLaboral = new RelacionLaboral(0,this.id_sucursal,0,"","","","","","","",0,"","","",0,"","","",0.00,0.00,"",1,true,[]);
  relaciones : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('modal_camera', {static: false}) modalCamera : any;
  modal : any;
  camera : any;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  public docB64 = "";
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public tipo_modal = 1;
  

  constructor(
    public modalService : NgbModal,
    private relacion_service : RelacionLaboralService,
    private documento_service : DocumentoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.obtenerRelaciones();
    this.url_foto ="../../../assets/img/defaults/image-default.png";
  }

  obtenerRelaciones(){
    let json = {
      id_sucursal : this.id_sucursal
    }
    this.relaciones = [];
    this.relacion_service.obtenerRelaciones(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.relaciones = object.data.relaciones;
      }
    });
  }

  buscar(){
    let json = {
      id_sucursal : this.id_sucursal,
      palabra : this.buscador
    }
    this.relacion_service.buscador(json)
    .subscribe((object : any) => {
      this.relaciones = object.data.busqueda;
    });
  }

  autoComplete(value : string){
    if(value.length > 0){
      this.autocomplete = [];
      let json = {
        id_sucursal : this.id_sucursal,
        palabra : value
      }
      this.relacion_service.buscador(json)
      .subscribe((object : any) => {
        this.autocomplete = object.data.busqueda;
      });
    }
  }

  obtenerDocs(tipo : number, arreglo : any){
    if(tipo == 1){
      this.documentos = [];
      this.documento_service.obtenerDocumentosRelacionConfigurados(this.id_empresa)
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

  nuevaAlta(){
    this.limpiar();
    this.obtenerDocs(1,null);
    this.tipo_modal = 1;
    this.modal = this.openModal(this.contenidoDelModal, 'lg');
  }
  
  altaRelacion(){
    this.relacionLaboral.documentos = [];
    let band = true;
    this.documentos.forEach((documento : any) => {
      if(documento.obligatorio == "1"){
        if(documento.documentoB64 == ""){
          band = false;
          Swal.fire("Ha ocurrido un error","El documento " + documento.nombre +" es obligatorio","error");
        }else{
          this.relacionLaboral.documentos.push({
            id_documentoDigital : documento.id_documentoDigital,
            documento : documento.documentoB64,
            extension : documento.extension
          });
        }
      }else{
        if(documento.documentoB64 != ""){
          this.relacionLaboral.documentos.push({
            id_documentoDigital : documento.id_documentoDigital,
            documento : documento.documentoB64,
            extension : documento.extension
          });
        }
      }
    });
    if(band){
      this.confirmar("Confirmación","¿Estas seguro de dar de alta está relacion?","info",null,1);
    }
  }

  ver(id : number){
    this.limpiar();
    this.tipo_modal = 2;
    this.obtenerDocs(1,null);
    this.relacion_service.obtenerRelacionPorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.relacionLaboral.id_fotografia = object.data.id_foto;
        this.url_foto = this.sanitizer.bypassSecurityTrustResourceUrl(object.data.user_img);
        this.relacionLaboral.id_RelacionLaboral = object.data.id_RelacionLaboral;
        this.relacionLaboral.numero_nomina = object.data.numero_nomina;
        this.relacionLaboral.apellido_p = object.data.apellido_p;
        this.relacionLaboral.apellido_m = object.data.apellido_m;
        this.relacionLaboral.nombres = object.data.nombres;
        this.relacionLaboral.fecha_nacimiento = object.data.fecha_nacimiento;
        this.relacionLaboral.edad = object.data.edad;
        this.relacionLaboral.curp = object.data.curp;
        this.relacionLaboral.rfc = object.data.rfc;
        this.relacionLaboral.correo = object.data.correo;
        this.relacionLaboral.telefono = object.data.telefono;
        this.relacionLaboral.direccion = object.data.direccion;
        this.relacionLaboral.departamento = object.data.departamento;
        this.relacionLaboral.puesto = object.data.puesto;
        this.relacionLaboral.sueldo_neto = object.data.sueldo_neto;
        this.relacionLaboral.sueldo_mensual = object.data.sueldo_mensual;
        this.relacionLaboral.fecha_ingreso = object.data.fecha_ingreso;
        //Pintar Docs
        this.obtenerDocs(2,object.data.documentos);
      }
    });
    this.modal = this.openModal(this.contenidoDelModal,'lg');
  }

  modificarRelacion(){
    this.relacionLaboral.documentos = [];
    let band = true;
    this.documentos.forEach((documento : any) => {
      if(documento.obligatorio == "1"){
        if(documento.documentoB64 != ""){
          this.relacionLaboral.documentos.push({
            id_documentoDigital : documento.id_documentoDigital,
            documento : documento.documentoB64,
            extension : documento.extension
          });
        }
      }else{
        if(documento.documentoB64 != ""){
          this.relacionLaboral.documentos.push({
            id_documentoDigital : documento.id_documentoDigital,
            documento : documento.documentoB64,
            extension : documento.extension
          });
        }
      }
    });
    if(band){
      this.confirmar("Confirmación","¿Estas seguro de modificar está relacion?","info",null,2);
    }
  }

  descarga(id_documentoDigital : number){
    this.documento_service.obtenerDocumentoRelacion(this.relacionLaboral.id_RelacionLaboral,id_documentoDigital)
    .subscribe((object : any) => {
        if(object.ok){
          var arrayBuffer = this.base64ToArrayBuffer(object.data.documento);
          var newBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });
          var data = window.URL.createObjectURL(newBlob);
          let link  = document.createElement('a');
          link.href = data;
          link.download = object.data.documentoDigital.replace(" ","")+"."+object.data.extension;
          link.click();
        }
    })
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
          this.relacion_service.altaRelacion(this.relacionLaboral)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","La relación se ha insertado con exito","success");
              this.obtenerRelaciones();
              this.modal.close();
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.relacion_service.modificarRelacion(this.relacionLaboral)
          .subscribe((object : any) => {
            if(object.ok){
              this.obtenerRelaciones();
              Swal.fire("Buen trabajo","La relación ha sido modificada","success");
            }
          });
        }
      }
    });
  }
  
  limpiar(){
    this.url_foto ="../../../assets/img/defaults/image-default.png";
    this.relacionLaboral = new RelacionLaboral(0,this.id_sucursal,0,"","","","","","","",0,"","","",0,"","","",0.00,0.00,"",1,true,[]);
  }
  
  subirDocumento(id : number){
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

  tomarFoto(){
    this.camera = this.openModal(this.modalCamera, 'md');
  }

  openModal(longContent : any, size : any) {
    return this.modalService.open(longContent, { scrollable: true, size: size, centered: true, backdrop: 'static', keyboard: false });
  }

  changeStyle($event : any){
    this.color = $event.type == 'mouseover' ? 'btn-info' : 'bg-gray';
  }
  //FOTOGRAFIA
  subirImagen(){
    document.getElementById("foto_user")?.click();
  }

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      this.relacionLaboral.extension_img = extension;
      if(extension == "jpg" || extension == "png"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.url_foto = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.docB64 = respuesta+"";
          this.relacionLaboral.user_img = respuesta+"";
          this.relacionLaboral.extension_img = extension;
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
    this.relacionLaboral.user_img = docB64[1];
    this.relacionLaboral.extension_img = "jpeg";
    this.camera.close();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
