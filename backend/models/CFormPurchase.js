import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("CFormPurchase", {
    id: { type: DataTypes.STRING, primaryKey: true },
    fromDate: DataTypes.DATEONLY,
    toDate: DataTypes.DATEONLY,
    buyerName: DataTypes.STRING,
    cFormNo1: DataTypes.STRING,
    cFormNo2: DataTypes.STRING,
    issuedDate: DataTypes.DATEONLY,
    formAmount: DataTypes.DECIMAL(18, 2),
    totalAmount: DataTypes.DECIMAL(18, 2),
    remarks: DataTypes.STRING,
    payload: { type: DataTypes.JSON, allowNull: false }
  });
};