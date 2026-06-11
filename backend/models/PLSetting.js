import { DataTypes } from "sequelize";

export default (sequelize) => sequelize.define("PLSetting", {
  id: { type: DataTypes.STRING, primaryKey: true },
  groupDescription: { type: DataTypes.STRING, allowNull: false },
  ledger: { type: DataTypes.STRING, allowNull: false },
  slNo1: { type: DataTypes.INTEGER, defaultValue: 0 },
  slNo: { type: DataTypes.INTEGER, defaultValue: 0 },
  payload: { type: DataTypes.JSON }
}, {
  tableName: "pl_settings",
  timestamps: true
});