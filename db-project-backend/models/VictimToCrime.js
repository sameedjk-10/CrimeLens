import { DataTypes } from "sequelize";

export default (sequelize) => {
  const VictimToCrime = sequelize.define("VictimToCrime", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    crime_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "crimes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    victim_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "victims", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  }, {
    tableName: "victim_to_crimes",
    timestamps: false,
  });

  return VictimToCrime;
};
