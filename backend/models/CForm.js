import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("CForm", {
    id: { type: DataTypes.STRING, primaryKey: true },
    fromDate: DataTypes.DATEONLY,
    toDate: DataTypes.DATEONLY,
    buyerName: DataTypes.STRING,
    cFormNo: DataTypes.STRING,
    receivedDate: DataTypes.DATEONLY,
    formAmount: DataTypes.DECIMAL(18, 2),
    totalAmount: DataTypes.DECIMAL(18, 2),
    isE1Form: DataTypes.BOOLEAN,
    agentName: DataTypes.STRING,
    tinNo: DataTypes.STRING,
    remarks: DataTypes.STRING,
    payload: { type: DataTypes.JSON, allowNull: false }
  });
};