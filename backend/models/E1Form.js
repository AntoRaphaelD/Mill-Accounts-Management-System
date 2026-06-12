import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("E1Form", {
    id: { type: DataTypes.STRING, primaryKey: true },
    fromDate: DataTypes.DATEONLY,
    toDate: DataTypes.DATEONLY,
    issuedDate: DataTypes.DATEONLY,
    entryDate: DataTypes.DATEONLY,
    partyName: DataTypes.STRING,
    cFormNo: DataTypes.STRING,
    cFormAmount: DataTypes.DECIMAL(18, 2),
    formNo: DataTypes.STRING,
    agentName: DataTypes.STRING,
    tinNo: DataTypes.STRING,
    remarks: DataTypes.STRING,
    payload: { type: DataTypes.JSON, allowNull: false }
  });
};