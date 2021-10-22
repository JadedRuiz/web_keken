export class RelacionLaboral {
    constructor(
        public id_RelacionLaboral : number,
        public id_sucursal : number,
        public id_fotografia : number,
        public user_img : string,
        public extension_img : string,
        public numero_nomina : string,
        public apellido_p : String,
        public apellido_m : String,
        public nombres : String,
        public fecha_nacimiento : String,
        public edad : number,
        public curp : string,
        public rfc : string,
        public correo : string,
        public telefono : number,
        public direccion : string,
        public puesto : string,
        public departamento :string,
        public sueldo_mensual : number,
        public sueldo_neto : number,
        public fecha_ingreso : string,
        public usuario_c : number,
        public activo : boolean,
        public documentos : any
    ){}
    
}