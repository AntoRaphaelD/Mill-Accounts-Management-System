import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProvisionItem = sequelize.define("ProvisionItem", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    provisionId: { type: DataTypes.STRING, allowNull: false },
    accountCode: DataTypes.STRING,
    debit: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
    credit: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
    narration: DataTypes.STRING,
    payload: { type: DataTypes.JSON, allowNull: false }
  });

  return ProvisionItem;
};