import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Criminal = sequelize.define("Criminal", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(255) },
    dob: { type: DataTypes.DATE },
    address: { type: DataTypes.STRING(255) },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(25) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: "criminals",
    timestamps: false,
  });

  return Criminal;
};
