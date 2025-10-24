import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PoliceAgentRequest = sequelize.define("PoliceAgentRequest", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    police_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "police_branches", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    role: { type: DataTypes.STRING(50), defaultValue: "police" },
    status: { type: DataTypes.STRING(20), defaultValue: "pending" },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: "police_agent_requests",
    timestamps: false,
  });

  return PoliceAgentRequest;
};
