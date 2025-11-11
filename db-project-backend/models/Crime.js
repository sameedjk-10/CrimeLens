import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Crime = sequelize.define("Crime", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    crime_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "crime_types", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING(50), defaultValue: "pending" },
    location: { type: DataTypes.GEOMETRY("POINT", 4326), allowNull: false },
    address: { type: DataTypes.TEXT },
    zone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      references: { model: "zones", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
    },
    severity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  }, {
    tableName: "crimes",
    timestamps: false,
  });

  return Crime;
};
