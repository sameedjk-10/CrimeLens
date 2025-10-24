import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UploadLog = sequelize.define("UploadLog", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    filename: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.STRING(50), defaultValue: "uploaded" },
    total_records: { type: DataTypes.INTEGER },
    records_uploaded: { type: DataTypes.INTEGER },
    uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: "upload_logs",
    timestamps: false,
  });

  return UploadLog;
};
