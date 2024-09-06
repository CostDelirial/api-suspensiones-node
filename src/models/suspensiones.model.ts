import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CatDucto } from './ductos.model';
import { CatMotivoSuspension } from './motivoSuspencion.model';
import { CatPersonalCC } from './personal.model';

@Table({
    tableName: 'suspensiones',
    timestamps: true // Agrega createdAt y updatedAt automáticamente
})
export class Suspensiones extends Model {
    
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    estatus!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    fechaHora!: Date;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    duracion!: number;

    @Column({
        type: DataType.STRING
    })
    observaciones!: string;

    @Column({
        type: DataType.DOUBLE
    })
    km!: number;

    @Column({
        type: DataType.INTEGER
    })
    bph!: number;

    @Column({
        type: DataType.INTEGER
    })
    bls!: number;

    @Column({
        type: DataType.DATE
    })
    seregistro!: Date;

    @Column({
        type: DataType.INTEGER
    })
    corte!: number;

    // Foreign keys and relationships
    @ForeignKey(() => CatDucto)
    @Column({
        type: DataType.INTEGER
    })
    ductoId!: number;

    @BelongsTo(() => CatDucto)
    ducto!: CatDucto;

    @ForeignKey(() => CatMotivoSuspension)
    @Column({
        type: DataType.INTEGER
    })
    motivoSuspensionId!: number;

    @BelongsTo(() => CatMotivoSuspension)
    motivoSuspension!: CatMotivoSuspension;

    @ForeignKey(() => CatPersonalCC)
    @Column({
        type: DataType.INTEGER
    })
    personalCCId!: number;

    @BelongsTo(() => CatPersonalCC)
    personalCC!: CatPersonalCC;
}
