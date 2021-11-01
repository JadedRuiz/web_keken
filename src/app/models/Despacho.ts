export class Despacho {
    constructor(
        public id_despacho : number,
        public id_empresa : number,
        public despacho : string,
        public rfc : string,
        public curp : string,
        public correo : string,
        public representate : string,
    ){}
}