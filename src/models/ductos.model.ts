import {  Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript'

@Table({
    tableName: 'cat_ducto',
    timestamps: true // Incluye createdAt y updatedAt automáticamente
})
export class CatDucto extends Model {
    
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
    @Column({
        type: DataType.INTEGER,
        defaultValue: 1 // 1: Activado, 2: Desactivado
    })
    estatus!: number;

    // Relación a la tabla `suspensiones`)
    // @HasMany(() => Suspension)
    // suspensiones!: Suspension[];
}