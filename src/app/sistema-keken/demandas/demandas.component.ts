import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Demanda } from 'src/app/models/Demanda';
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
  modal : any;
  autocomplete : any;
  relaciones : any;
  relacion_seleccionada = 0;
  demanda = new Demanda(0,0,"",0,"","",0,0,"",0,true,[],[]);
  buscador = "";
  relacion = "";
  myControl = new FormControl();
  audiencia = {
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

  constructor(
    public modalService : NgbModal,
    private relacion_service : RelacionLaboralService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
  }

  abrirAlta(){
    this.modal = this.openModal(this.contenidoDelModal,'md');
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
    this.relacion_seleccionada = parseInt(event.option.id+"");
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
