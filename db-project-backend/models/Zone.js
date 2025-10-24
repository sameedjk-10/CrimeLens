import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Zone = sequelize.define("Zone", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    geom: { type: DataTypes.GEOMETRY("POLYGON", 4326), allowNull: true },
  }, {
    tableName: "zones",
    timestamps: false,
  });

  return Zone;
};
