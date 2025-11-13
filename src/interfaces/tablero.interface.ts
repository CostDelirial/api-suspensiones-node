export default interface ITablero {
    uuid_ducto: string;
    uuid_motivo: string;
    fecha_usuario: Date;
          
    fechaCreacion: Date;   
    fechaModificacion?: Date; 
    usuarioCreacion: string; 
    usuarioModificacion?: string; 
    status: boolean;      
    uuid?: number;
}
