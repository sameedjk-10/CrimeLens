import { DataTypes } from "sequelize";

export default (sequelize) => {
  const AuditLog = sequelize.define("AuditLog", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    action: { type: DataTypes.STRING(100), allowNull: false },
    target_table: { type: DataTypes.STRING(100) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: "audit_logs",
    timestamps: false,
  });

  return AuditLog;
};
