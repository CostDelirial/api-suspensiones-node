export default interface ICatDucto {
    nombre: string;          
    fechaCreacion: Date;    // Fecha en la que se creó el registro
    fechaModificacion?: Date; // Fecha de la última modificación
    usuarioCreacion: string; // Usuario que creó el registro
    usuarioModificacion?: string; // Usuario que modificó el registro 
    estatus: boolean;       // Indica si el registro está activo o inactivo
    id?: number;
}
