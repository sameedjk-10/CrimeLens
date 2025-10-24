import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PoliceBranch = sequelize.define("PoliceBranch", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    branch_head_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    zone_id: {
      type: DataTypes.INTEGER,
      unique: true,
      references: {
        model: "zones",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    name: { type: DataTypes.STRING(50), allowNull: false },
    address: { type: DataTypes.STRING(255) },
    contact_number: { type: DataTypes.STRING(50) },
    location: { type: DataTypes.GEOMETRY("POINT", 4326) },
  }
  , {
    tableName: "police_branches",
    timestamps: false,
  });

  return PoliceBranch;
};
