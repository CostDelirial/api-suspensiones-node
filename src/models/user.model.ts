import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({
    tableName: 'users',
    timestamps: true
})

export class User extends Model<User>{

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
        unique:true,
    })
    ficha!: number
    
    @Column({
        type: DataType.STRING,
        allowNull:false
    })
    password!: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    tipo!: number;
}