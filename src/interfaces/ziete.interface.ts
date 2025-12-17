export default interface IZiete {
    id?: number;
    uuidDucto: string; // ID DEL DUCTO
    nDucto: string; // NOMBRE DEL DUCTO
    tOperando: string; // TIEMPO OPERANDO
    dOperando: number; // DIAS OPERANDO
    tFueraOpe: string; // TIEMPO FUERA DE OPERACION
    dFueraOpe: number; // DIAS FUERA DE OPERACION
    pTO: number; // PORCENTAJE DE TIEMPO OPERANDO
    pFO: number; // PORCENTAJE DE TIEMPO FUERA DE OPERACION
    pLogistico: number; // PORCENTAJE DE SUSPENSION LOGISTICO
    pNoLogistico: number; // PORCENTAJE DE SUSPENSION NO LOGISTICO
    fini: Date; // FECHA FILTRO INICIO
    ffin: Date; // FECHA FILTRO FIN
}
