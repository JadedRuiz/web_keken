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
export class CompartidoService {

    constructor(
        private cookies: CookieService,
        public http: HttpClient
    ) { }

    obtenerPerfiles(){
        let url = SERVER_API+"obtenerPerfiles";
        return this.http.get(url);
    }
}