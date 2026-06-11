import { DataTypes } from "sequelize";

export default (sequelize) => sequelize.define("ServiceTaxMaster", {
  code: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING },
  rate: { type: DataTypes.DECIMAL(8, 3) },
  payload: { type: DataTypes.JSON }
});
