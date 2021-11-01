import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AudienciaService {

    constructor(
        public http: HttpClient
    ) { }

    altaAudiencia(json : any){
        let url = SERVER_API+"audiencia/altaAudiencia";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }
    obtenerAudiencias(id : string){
        let url = SERVER_API+"audiencia/obtenerAudiencias/"+id;
        return this.http.get(url) 
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }
}