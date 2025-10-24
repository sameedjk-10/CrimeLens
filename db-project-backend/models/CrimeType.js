import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CrimeType = sequelize.define("CrimeType", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
  }, {
    tableName: "crime_types",
    timestamps: false,
  });

  return CrimeType;
};
