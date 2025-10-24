import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Victim = sequelize.define("Victim", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    gender: { type: DataTypes.CHAR(1) },
    age: { type: DataTypes.INTEGER },
    contact: { type: DataTypes.STRING(100) },
    address: { type: DataTypes.STRING(255) },
  }, {
    tableName: "victims",
    timestamps: false,
  });

  return Victim;
};
