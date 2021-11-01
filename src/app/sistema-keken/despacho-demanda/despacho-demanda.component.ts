import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DemandaService } from 'src/app/services/Sistema_RL/Demanda.service';

@Component({
  selector: 'app-despacho-demanda',
  templateUrl: './despacho-demanda.component.html',
  styleUrls: ['./despacho-demanda.component.css']
})
export class DespachoDemandaComponent implements OnInit {

  myControl = new FormControl();
  buscador = "";
  id_despacho = window.localStorage.getItem("id_opcion");
  demandas : any;

  constructor(
    private demanda_service : DemandaService
  ) { }

  ngOnInit(): void {
    this.mostarDemandas();
  }

  mostarDemandas(){
    this.demandas = [];
    this.demanda_service.obtenerDemandasPorIdDespacho(this.id_despacho)
    .subscribe((object : any) => {
      if(object.ok){
        this.demandas = object.data;
      }
    });
  }

  autoComplete(event : any){

  }

  buscar(){

  }

}
