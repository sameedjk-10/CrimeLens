import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CrimeToCriminal = sequelize.define("CrimeToCriminal", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    crime_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "crimes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    criminal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "criminals", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  }, {
    tableName: "crime_to_criminals",
    timestamps: false,
  });

  return CrimeToCriminal;
};
