import { DataTypes } from "sequelize";

export default (sequelize) => sequelize.define("BSMainGroup", {
  code: { type: DataTypes.STRING, primaryKey: true },
  mainGroup: { type: DataTypes.STRING, allowNull: false },
  under: { type: DataTypes.STRING, allowNull: false },
  payload: { type: DataTypes.JSON }
}, {
  tableName: "bs_main_groups",
  timestamps: true
});