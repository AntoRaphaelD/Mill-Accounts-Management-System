import { DataTypes } from "sequelize";

export default (sequelize) => sequelize.define("BSGroup", {
  code: { type: DataTypes.STRING, primaryKey: true },
  bsGroup: { type: DataTypes.STRING, allowNull: false },
  accGroup: { type: DataTypes.STRING, allowNull: true },
  slNo: { type: DataTypes.INTEGER, defaultValue: 0 },
  ifNegative: { type: DataTypes.STRING, allowNull: true },
  defaultSide: { type: DataTypes.STRING, defaultValue: "Credit" },
  payload: { type: DataTypes.JSON }
}, {
  tableName: "bs_groups",
  timestamps: true
});