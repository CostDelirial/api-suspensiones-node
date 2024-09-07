import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, HasMany } from 'sequelize-typescript';
import { CatMotivoSuspension } from './motivoSuspencion.model'; // Importa el modelo relacionado

@Table({
    tableName: 'cat_logistica',
    timestamps: true 
})
export class CatLogistica extends Model {
    
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: 'El nombre es obligatorio'
            }
        }
    })
    nombre!: string;

    // Relación uno a muchos con cat_motivoSuspension
    @HasMany(() => CatMotivoSuspension) // Relación uno a muchos (HasMany)
    catMotivoSuspension!: CatMotivoSuspension[];
}
