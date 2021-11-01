export class Demanda {
    constructor(
        public id_demanda : number,
        public id_RelacionLaboral : number,
        public abogado_demandante : string,
        public telefono_demandante : string,
        public correo_demandante : string,
        public tipo_riesgo : string,
        public id_estatus : number,
        public id_catDespacho : number,
        public abogado_cargo : string,
        public usuario_c : number,
        public activo : boolean,
        public audiencias : any,
        public documentos : any
    ){}
    
}