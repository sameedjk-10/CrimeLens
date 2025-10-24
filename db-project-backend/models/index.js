import sequelize from "../config/db.js";

// Import all models
import RoleModel from "./Role.js";
import UserModel from "./User.js";
import ZoneModel from "./Zone.js";
import PoliceBranchModel from "./PoliceBranch.js";
import CrimeTypeModel from "./CrimeType.js";
import CrimeModel from "./Crime.js";
import VictimModel from "./Victim.js";
import VictimToCrimeModel from "./VictimToCrime.js";
import CriminalModel from "./Criminal.js";
import CrimeToCriminalModel from "./CrimeToCriminal.js";
import CrimeSubmissionModel from "./CrimeSubmission.js";
import PoliceAgentRequestModel from "./PoliceAgentRequest.js";
import UploadLogModel from "./UploadLog.js";
import AuditLogModel from "./AuditLog.js";

// Initialize models
const Role = RoleModel(sequelize);
const User = UserModel(sequelize);
const Zone = ZoneModel(sequelize);
const PoliceBranch = PoliceBranchModel(sequelize);
const CrimeType = CrimeTypeModel(sequelize);
const Crime = CrimeModel(sequelize);
const Victim = VictimModel(sequelize);
const VictimToCrime = VictimToCrimeModel(sequelize);
const Criminal = CriminalModel(sequelize);
const CrimeToCriminal = CrimeToCriminalModel(sequelize);
const CrimeSubmission = CrimeSubmissionModel(sequelize);
const PoliceAgentRequest = PoliceAgentRequestModel(sequelize);
const UploadLog = UploadLogModel(sequelize);
const AuditLog = AuditLogModel(sequelize);

//
// ─── RELATIONSHIPS ─────────────────────────────────────────────
//

// 1️⃣ Roles ↔ Users (One-to-Many)
Role.hasMany(User, { foreignKey: "role_id", onDelete: "RESTRICT" });
User.belongsTo(Role, { foreignKey: "role_id" });

// 2️⃣ Zones ↔ PoliceBranches (One-to-One)
Zone.hasOne(PoliceBranch, { foreignKey: "zone_id", onDelete: "CASCADE" });
PoliceBranch.belongsTo(Zone, { foreignKey: "zone_id" });

// 3️⃣ Users ↔ PoliceBranches (One-to-One via Branch Head)
User.hasOne(PoliceBranch, { foreignKey: "branch_head_id", onDelete: "CASCADE" });
PoliceBranch.belongsTo(User, { foreignKey: "branch_head_id" });

// 4️⃣ Zones ↔ Crimes (One-to-Many)
Zone.hasMany(Crime, { foreignKey: "zone_id", onDelete: "SET NULL" });
Crime.belongsTo(Zone, { foreignKey: "zone_id" });

// 5️⃣ CrimeTypes ↔ Crimes (One-to-Many)
CrimeType.hasMany(Crime, { foreignKey: "crime_type_id", onDelete: "RESTRICT" });
Crime.belongsTo(CrimeType, { foreignKey: "crime_type_id" });

// 6️⃣ Crimes ↔ Victims (Many-to-Many via VictimToCrime)
Crime.belongsToMany(Victim, {
  through: VictimToCrime,
  foreignKey: "crime_id",
  onDelete: "CASCADE",
});
Victim.belongsToMany(Crime, {
  through: VictimToCrime,
  foreignKey: "victim_id",
  onDelete: "CASCADE",
});

// 7️⃣ Crimes ↔ Criminals (Many-to-Many via CrimeToCriminal)
Crime.belongsToMany(Criminal, {
  through: CrimeToCriminal,
  foreignKey: "crime_id",
  onDelete: "CASCADE",
});
Criminal.belongsToMany(Crime, {
  through: CrimeToCriminal,
  foreignKey: "criminal_id",
  onDelete: "CASCADE",
});

// 8️⃣ Zones ↔ CrimeSubmissions (One-to-Many)
Zone.hasMany(CrimeSubmission, { foreignKey: "zone_id", onDelete: "SET NULL" });
CrimeSubmission.belongsTo(Zone, { foreignKey: "zone_id" });

// 9️⃣ Crimes ↔ CrimeSubmissions (One-to-One if verified)
Crime.hasOne(CrimeSubmission, {
  foreignKey: "verified_crime_id",
  onDelete: "SET NULL",
});
CrimeSubmission.belongsTo(Crime, {
  foreignKey: "verified_crime_id",
});

// 🔟 Users ↔ PoliceAgentRequests (One-to-Many)
User.hasMany(PoliceAgentRequest, { foreignKey: "police_id", onDelete: "CASCADE" });
PoliceAgentRequest.belongsTo(User, { foreignKey: "police_id" });

// 11️⃣ PoliceBranches ↔ PoliceAgentRequests (One-to-Many)
PoliceBranch.hasMany(PoliceAgentRequest, {
  foreignKey: "branch_id",
  onDelete: "CASCADE",
});
PoliceAgentRequest.belongsTo(PoliceBranch, { foreignKey: "branch_id" });

// 12️⃣ Users ↔ AuditLogs (One-to-Many)
User.hasMany(AuditLog, { foreignKey: "user_id", onDelete: "SET NULL" });
AuditLog.belongsTo(User, { foreignKey: "user_id" });

//
// ─── EXPORT ALL MODELS ─────────────────────────────────────────
//
const db = {
  sequelize,
  Role,
  User,
  Zone,
  PoliceBranch,
  CrimeType,
  Crime,
  Victim,
  VictimToCrime,
  Criminal,
  CrimeToCriminal,
  CrimeSubmission,
  PoliceAgentRequest,
  UploadLog,
  AuditLog,
};

export default db;
