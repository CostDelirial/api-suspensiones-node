import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
    tableName: 'cat_personalCC',
    timestamps: true 
})
export class CatPersonalCC extends Model {

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
    nombre!: string;

    // @HasMany(() => Suspension)
    // suspension!: Suspension[];
}
