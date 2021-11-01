import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';
import { Usuario } from '../models/Usuario';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/Usuario/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public color = COLOR;
  public usuario = new Usuario(0,0,0,"","","","","",0,0);
  constructor(
    private usuario_service : UsuarioService,
    private router : Router
  ) { }

  ngOnInit(): void {
    //Si existen variables de sesion las iniciamos
  }
  public login(f : NgForm){
    if(f.invalid){
      return ;
    }else{
      this.usuario_service.login(this.usuario)
      .subscribe((object : any) => {
        if(object.ok){
          window.localStorage.setItem("id_usuario",object.data.id_usuario);
          window.localStorage.setItem("id_empresa",object.data.id_empresa);
          window.localStorage.setItem("id_perfil",object.data.id_perfil);
          window.localStorage.setItem("nombre",object.data.nombre);
          window.localStorage.setItem("url_empresa",object.data.url_empresa);
          window.localStorage.setItem("url_foto",object.data.url_foto);
          if(object.data.id_perfil == 3 || object.data.id_perfil == 4 || object.data.id_perfil == 5){
            window.localStorage.setItem("id_opcion",object.data.id_opcion);
          }
          this.router.navigate(['/sistema_rl/dashboard']);
        }
      });
    }
  }
  eleccion(id : any){
    
  }
  openModal() {
  }
  closeModal(){
  }
  redirigirPrincipal(id : any){
    
  }
  redireccionNomina(id : any){
  }
}
