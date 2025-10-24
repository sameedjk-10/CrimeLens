import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CrimeSubmission = sequelize.define("CrimeSubmission", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    submitter_name: { type: DataTypes.STRING(200) },
    submitter_contact: { type: DataTypes.STRING(200) },
    submitter_cnic: { type: DataTypes.STRING(200) },
    zone_id: {
      type: DataTypes.INTEGER,
      references: { model: "zones", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    incident_date: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    submitted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.STRING(50), defaultValue: "pending" },
    verified_crime_id: {
      type: DataTypes.BIGINT,
      references: { model: "crimes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  }, {
    tableName: "crime_submissions",
    timestamps: false,
  });

  return CrimeSubmission;
};
