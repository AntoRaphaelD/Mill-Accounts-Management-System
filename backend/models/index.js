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
import defineCForm from "./CForm.js";
import defineFForm from "./FForm.js";
import defineHForm from "./HForm.js";
import defineE1Form from "./E1Form.js";
import defineCFormPurchase from "./CFormPurchase.js";
import defineProvision from "./Provision.js";
import defineProvisionItem from "./ProvisionItem.js";

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
const CForm = defineCForm(sequelize);
const FForm = defineFForm(sequelize);
const HForm = defineHForm(sequelize);
const E1Form = defineE1Form(sequelize);
const CFormPurchase = defineCFormPurchase(sequelize);
const Provision = defineProvision(sequelize);
const ProvisionItem = defineProvisionItem(sequelize);

const AppRecord = sequelize.define("AppRecord", {
  collection: { type: DataTypes.STRING, primaryKey: true },
  recordKey: { type: DataTypes.STRING, primaryKey: true },
  payload: { type: DataTypes.JSON, allowNull: false }
});

Voucher.hasMany(VoucherItem, { foreignKey: "voucherId", sourceKey: "id", as: "items", onDelete: "CASCADE" });
VoucherItem.belongsTo(Voucher, { foreignKey: "voucherId", targetKey: "id" });
ContraEntry.hasMany(ContraEntryItem, { foreignKey: "contraEntryId", sourceKey: "id", as: "items", onDelete: "CASCADE" });
ContraEntryItem.belongsTo(ContraEntry, { foreignKey: "contraEntryId", targetKey: "id" });
Provision.hasMany(ProvisionItem, { foreignKey: "provisionId", sourceKey: "id", as: "items", onDelete: "CASCADE" });
ProvisionItem.belongsTo(Provision, { foreignKey: "provisionId", targetKey: "id" });

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
  BillWiseOpening,
  CForm,
  FForm,
  HForm,
  E1Form,
  CFormPurchase,
  Provision,
  ProvisionItem
};
