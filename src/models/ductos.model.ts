import {  Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript'

@Table({
    tableName: 'cat_ducto',
    timestamps: true // Incluye createdAt y updatedAt automáticamente
})
export default class DuctosModel extends Model<DuctosModel> {
    
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
    name!: string;

    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true // true: Activado, false: Desactivado
    })
    status!: boolean;

    // Relación a la tabla `suspensiones`)
    // @HasMany(() => Suspension)
    // suspensiones!: Suspension[];
}