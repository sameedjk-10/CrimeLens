import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Role = sequelize.define("Role", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: "roles",
    timestamps: false,
    indexes: [{ unique: true, fields: ["name"] }],
  });

  return Role;
};
