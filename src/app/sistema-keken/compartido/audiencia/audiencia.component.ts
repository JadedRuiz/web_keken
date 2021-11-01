import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AudienciaService } from 'src/app/services/Sistema_RL/Audiencia.service';

@Component({
  selector: 'app-audiencia',
  templateUrl: './audiencia.component.html',
  styleUrls: ['./audiencia.component.css']
})
export class AudienciaComponent implements OnInit {

  @Input() id_demanda : number;
  audiencias : any;  
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
  modal : any;
  @ViewChild('content', {static: false}) modal_content : any;

  constructor(
    private modal_service : NgbModal,
    private audiencia_service : AudienciaService
  ) { 
    this.id_demanda = 0;
  }

  ngOnInit(): void {
  }

  mostrarAudiencias(id : number){
    this.audiencias = [];
    this.audiencia_service.obtenerAudiencias(id+"")
    .subscribe((object : any) => {
      if(object.ok){
        this.audiencias = object.data;
      }
    });
  }

  ver(id : number){
    this.mostrarAudiencias(id);
    this.modal = this.openModal(this.modal_content,'md');
  }

  altaAudiencia(){

  }

  visualizarPDF(id_audiencia : number){

  }

  subirDocumento(id : string){

  }

  cambiarDoc(event : any){

  }

  openModal(longContent : any, size : any) {
    return this.modal_service.open(longContent, { scrollable: true, size: size, centered: true, backdrop: 'static', keyboard: false });
  }
}
