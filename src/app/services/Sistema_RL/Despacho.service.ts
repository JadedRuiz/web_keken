import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DespachoService {

    constructor(
        private cookies: CookieService,
        public http: HttpClient
    ) { }

    obtenerDespachos(id : any){
        let url = SERVER_API+"despacho/obtenerDespachos/"+id;
        return this.http.get(url)
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }

    altaDespacho(json : any){
        let url = SERVER_API+"despacho/altaDespacho";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }
}