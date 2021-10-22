import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

    constructor(
        public http: HttpClient
    ) { }

    obtenerDocumentosRelacionConfigurados(id : any){
        let url = SERVER_API+"documento/obtenerDocumentosRelacionConfigurados/"+id;
        return this.http.get(url)
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }

    obtenerDocumentoRelacion(id_relacion : number, id_doc : number){
        let url = SERVER_API+"documento/obtenerDocumentoRelacion/"+id_relacion+"/"+id_doc;
        return this.http.get(url)
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }
    // buscador(json : any){
    //     let url = SERVER_API+"relacion/buscador";
    //     return this.http.post( url, json )
    //     .pipe(map( (resp: any) => {
    //         return resp;
    //     }), catchError(err => {
    //         Swal.fire("Ha ocurrido un error", err.error.message, 'error');
    //         return throwError(err);
    //     }));
    // }

    // obtenerRelaciones(json : any){
    //     let url = SERVER_API+"relacion/obtenerRelaciones";
    //     return this.http.post( url, json )
    //     .pipe(map( (resp: any) => {
    //         return resp;
    //     }));
    // }
}