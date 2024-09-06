import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CatLogistica } from './logistica.model'; // Importa el modelo relacionado

@Table({
    tableName: 'cat_motivoSuspension',
    timestamps: true // Ajusta esto según tus necesidades
})
export class CatMotivoSuspension extends Model {
    
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

    @AllowNull(false)
    @ForeignKey(() => CatLogistica) // Define la clave foránea hacia cat_logistica
    @Column({
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: 'Debes seleccionar una logística'
            }
        }
    })
    logisticaId!: number;

    @BelongsTo(() => CatLogistica) // Relación muchos-a-uno con cat_logistica
    logistica!: CatLogistica;

    // Si tienes otras relaciones como "suspension", podrías agregar aquí HasMany o belongsToMany, según corresponda.
    // @HasMany(() => Suspension)
    // suspension!: Suspension[];
}
