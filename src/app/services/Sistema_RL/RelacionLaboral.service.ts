import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { RelacionLaboral } from 'src/app/models/RelacionLaboral';

@Injectable({
  providedIn: 'root'
})
export class RelacionLaboralService {

    constructor(
        public http: HttpClient
    ) { }

    buscador(json : any){
        let url = SERVER_API+"relacion/buscador";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }

    obtenerRelaciones(json : any){
        let url = SERVER_API+"relacion/obtenerRelaciones";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
            return resp;
        }));
    }

    altaRelacion(rela : RelacionLaboral){
        let url = SERVER_API+"relacion/altaRelacion";
        return this.http.post( url, rela )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }

    modificarRelacion(rela : RelacionLaboral){
        let url = SERVER_API+"relacion/modificarRelacion";
        return this.http.post( url, rela )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }

    obtenerRelacionPorId(id : any){
        let url = SERVER_API+"relacion/obtenerRelacionPorId/"+id;
        return this.http.get(url)
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }
}