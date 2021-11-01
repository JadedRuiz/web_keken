import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private cookies: CookieService,
    public http: HttpClient
    ) { }

  login(usuario : Usuario){
    let url = SERVER_API+"usuario/login";
    return this.http.post( url, usuario )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  estalogueado() {
    return (window.localStorage.getItem("id_usuario") != null ) ? true : false;
  }
  altaUsuario(usuario : Usuario){
    let url = SERVER_API+"usuario/nuevoUsuario";
    return this.http.post( url, usuario )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  modificarUsuario(json : any){
    let url = SERVER_API+"usuario/modificarUsuario";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  obtenerUsuarios(id : any){
    let url = SERVER_API+"usuario/obtenerUsuarios/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  obtenerUsuarioPorId(id : any){
    let url = SERVER_API+"usuario/obtenerUsuarioPorId/"+id;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
  autoCompleteUsuario(json : any){
    let url = SERVER_API+"usuario/autoCompleteUsuario";
    return this.http.post( url, json )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }
}
