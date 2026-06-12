import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Provision = sequelize.define("Provision", {
    id: { type: DataTypes.STRING, primaryKey: true },
    voucherNo: DataTypes.STRING,
    voucherDate: DataTypes.DATEONLY,
    type: DataTypes.STRING,
    totalAmount: DataTypes.DECIMAL(18, 2),
    payload: { type: DataTypes.JSON, allowNull: false }
  });

  return Provision;
};