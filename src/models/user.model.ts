import { Table, Column, Model, DataType, AllowNull, Unique } from 'sequelize-typescript';

@Table({
    tableName: 'users',
    timestamps: true,
})
export default class UserModel extends Model<UserModel> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;
    @Unique
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    ficha!: number;
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    status!: string;
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    role!:string;
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string
}