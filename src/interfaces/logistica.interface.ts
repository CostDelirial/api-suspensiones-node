export interface ICatLogistica {
    id: number;
    nombre: string;
    
    // Relación con CatMotivoSuspension
    catMotivoSuspension?: any[];
}
