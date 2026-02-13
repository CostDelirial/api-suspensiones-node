export default interface ICatPuesto {
    name: string;           // name de la entidad
    nivel: number;
    fechaCreacion: Date;    // Fecha en la que se creó el registro
    fechaModificacion?: Date; // Fecha de la última modificación (opcional)
    usuarioCreacion: string; // Usuario que creó el registro
    usuarioModificacion?: string; // Usuario que modificó el registro (opcional)
    status: boolean;       // Indica si el registro está activo o inactivo
    id?: number;
}
