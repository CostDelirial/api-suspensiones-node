import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    ficha!: number;
}