import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/sequelize';

export class UserModel extends Model {
  public uuid!: string;
  public name!: string;
  public ficha!: number;
  public password!: string;
  public status!: string;
  public role!: string;
  public nivel!: string;
  public salt!: string;
  public gerencia!: string;
  public subgerencia!: string;
  public superintendencia!: string;
  public rubrica!: string;
  public fechaCreacion!: Date;
  public usuarioCreacion!: string;
  public fechaActualizacion!: Date;
  public usuarioActualizacion!: string;
  public email!: string;
  public phone!: number;
}

UserModel.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ficha: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING,
    status: DataTypes.STRING,
    role: DataTypes.STRING,
    nivel: DataTypes.STRING,
    salt: DataTypes.STRING,
    gerencia: DataTypes.STRING,
    subgerencia: DataTypes.STRING,
    superintendencia: DataTypes.STRING,
    rubrica: DataTypes.STRING,
    fechacreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    usuariocreacion: DataTypes.STRING,
    fechaactualizacion: DataTypes.DATE,
    usuarioactualizacion: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.INTEGER,
  },
  {
    sequelize, 
    modelName: 'User',
    tableName: 'user',
    timestamps: false,
  }
);