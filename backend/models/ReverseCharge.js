import { DataTypes } from "sequelize";

export default (sequelize) => sequelize.define("ReverseCharge", {
  code: { type: DataTypes.STRING, primaryKey: true },
  purchaseType: { type: DataTypes.STRING, allowNull: true },
  
  assessValueFormula: { type: DataTypes.STRING },
  assessValueDesc: { type: DataTypes.STRING },
  roundOffFormula: { type: DataTypes.STRING },
  roundOffDesc: { type: DataTypes.STRING },
  lorryFreightFormula: { type: DataTypes.STRING },
  lorryFreightDesc: { type: DataTypes.STRING },
  
  sgstFormula: { type: DataTypes.STRING },
  sgstLedger: { type: DataTypes.STRING },
  cgstFormula: { type: DataTypes.STRING },
  cgstLedger: { type: DataTypes.STRING },
  igstFormula: { type: DataTypes.STRING },
  igstLedger: { type: DataTypes.STRING },
  
  creditSgstLedger: { type: DataTypes.STRING },
  creditCgstLedger: { type: DataTypes.STRING },
  creditIgstLedger: { type: DataTypes.STRING },
  
  payload: { type: DataTypes.JSON }
}, { tableName: "reverse_charge_masters", timestamps: true });