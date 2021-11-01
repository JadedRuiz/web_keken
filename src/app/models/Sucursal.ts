export class Sucursal {
    constructor(
        public id_sucursal : number,
        public id_estado : number,
        public id_region : number,
        public id_empresa : number,
        public sucursal : string,
        public rfc : string,
        public curp : string,
        public correo : string,
        public representate : string,
    ){}
}