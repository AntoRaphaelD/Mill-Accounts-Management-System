import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("FForm", {
    id: { type: DataTypes.STRING, primaryKey: true },
    fromDate: DataTypes.DATEONLY,
    toDate: DataTypes.DATEONLY,
    partyName: DataTypes.STRING,
    formNo: DataTypes.STRING,
    receivedDate: DataTypes.DATEONLY,
    formAmount: DataTypes.DECIMAL(18, 2),
    remarks: DataTypes.STRING,
    payload: { type: DataTypes.JSON, allowNull: false }
  });
};