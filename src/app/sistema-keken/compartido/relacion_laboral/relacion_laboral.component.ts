import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RelacionLaboral } from 'src/app/models/RelacionLaboral';
import { DocumentoService } from 'src/app/services/Sistema_RL/Documento.service';
import { RelacionLaboralService } from 'src/app/services/Sistema_RL/RelacionLaboral.service';

@Component({
  selector: 'app-relacion-laboral',
  templateUrl: './relacion_laboral.component.html',
  styleUrls: ['./relacion_laboral.component.css']
})
export class RelacionLaboralComponent implements OnInit {

  id_sucursal = 1;
  @Input() id_relacion : number;
  id_empresa = 1;
  modal : any;
  documentos : any;
  url_foto : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  relacionLaboral = new RelacionLaboral(0,this.id_sucursal,0,"","","","","","","",0,"","","",0,"","","",0.00,0.00,"","",1,true,[]);

  constructor(
    public modalService : NgbModal,
    private relacion_service : RelacionLaboralService,
    private documento_service : DocumentoService,
    private sanitizer: DomSanitizer) {
      this.id_relacion = 0;
     }

  ngOnInit(): void {
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

  ver(id : number){
    this.limpiar();
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
        this.relacionLaboral.sueldo_diario = object.data.sueldo_diario;
        this.relacionLaboral.fecha_ingreso = object.data.fecha_ingreso;
        this.relacionLaboral.fecha_baja = object.data.fecha_baja;
        //Pintar Docs
        this.obtenerDocs(2,object.data.documentos);
      }
    });
    this.modal = this.openModal(this.contenidoDelModal,'lg');
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

  subirDocumento(id : number){
    document.getElementById("adjunta"+id)?.click();
  }

  openModal(longContent : any, size : any) {
    return this.modalService.open(longContent, { scrollable: true, size: size, centered: true, backdrop: 'static', keyboard: false });
  }

  limpiar(){
    this.url_foto ="../../../assets/img/defaults/image-default.png";
    this.relacionLaboral = new RelacionLaboral(0,this.id_sucursal,0,"","","","","","","",0,"","","",0,"","","",0.00,0.00,"","",1,true,[]);
  }
}
