export interface ISuspensiones {
    id: number;
    estatus: string;
    fechaHora: Date;
    duracion: number;
    observaciones?: string;
    km?: number;
    bph?: number;
    bls?: number;
    seregistro?: Date;
    corte?: number;
    ductoId: number;
    motivoSuspensionId: number;
    personalCCId: number;
    
    // Relaciones
    ducto?: any;
    motivoSuspension?: any;
    personalCC?: any;
}
