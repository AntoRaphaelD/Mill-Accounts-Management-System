import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import defineUser from "./User.js";
import defineAccount from "./Account.js";
import defineGroup from "./Group.js";
import defineSubGroup from "./SubGroup.js";
import defineVoucher from "./Voucher.js";
import defineVoucherItem from "./VoucherItem.js";
import defineTDSMaster from "./TDSMaster.js";
import defineServiceTaxMaster from "./ServiceTaxMaster.js";
import defineAuditLog from "./AuditLog.js";
import definePLSetting from "./PLSetting.js";
import defineBSMainGroup from "./BSMainGroup.js";
import defineBSGroup from "./BSGroup.js";
import defineReverseCharge from "./ReverseCharge.js";
import defineContraEntry from "./ContraEntry.js";
import defineContraEntryItem from "./ContraEntryItem.js";
import defineBillWiseOpening from "./BillWiseOpening.js";

const User = defineUser(sequelize);
const Account = defineAccount(sequelize);
const Group = defineGroup(sequelize);
const SubGroup = defineSubGroup(sequelize);
const Voucher = defineVoucher(sequelize);
const VoucherItem = defineVoucherItem(sequelize);
const TDSMaster = defineTDSMaster(sequelize);
const ServiceTaxMaster = defineServiceTaxMaster(sequelize);
const AuditLog = defineAuditLog(sequelize);
const PLSetting = definePLSetting(sequelize);
const BSMainGroup = defineBSMainGroup(sequelize);
const BSGroup = defineBSGroup(sequelize);
const ReverseCharge = defineReverseCharge(sequelize);
const ContraEntry = defineContraEntry(sequelize);
const ContraEntryItem = defineContraEntryItem(sequelize);
const BillWiseOpening = defineBillWiseOpening(sequelize);

const AppRecord = sequelize.define("AppRecord", {
  collection: { type: DataTypes.STRING, primaryKey: true },
  recordKey: { type: DataTypes.STRING, primaryKey: true },
  payload: { type: DataTypes.JSON, allowNull: false }
});

Voucher.hasMany(VoucherItem, { foreignKey: "voucherId", sourceKey: "id", as: "items", onDelete: "CASCADE" });
VoucherItem.belongsTo(Voucher, { foreignKey: "voucherId", targetKey: "id" });
ContraEntry.hasMany(ContraEntryItem, { foreignKey: "contraEntryId", sourceKey: "id", as: "items", onDelete: "CASCADE" });
ContraEntryItem.belongsTo(ContraEntry, { foreignKey: "contraEntryId", targetKey: "id" });

export {
  sequelize,
  User,
  Account,
  Group,
  SubGroup,
  Voucher,
  VoucherItem,
  TDSMaster,
  ServiceTaxMaster,
  AuditLog,
  AppRecord,
  PLSetting,
  BSMainGroup,
  BSGroup,
  ReverseCharge,
  ContraEntry,
  ContraEntryItem,
  BillWiseOpening
};
