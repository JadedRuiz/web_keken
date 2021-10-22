export class Usuario {
    constructor(
        public id_usuario : number,
        public id_empresa : number,
        public id_perfil : number,
        public usuario : String,
        public password : String,
        public nombre : String,
        public avatar : String,
        public usuario_creacion : number
    ){}
    
}