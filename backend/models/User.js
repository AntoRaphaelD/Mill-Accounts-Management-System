import { DataTypes } from "sequelize";

export default (sequelize) => sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userName: { type: DataTypes.STRING, allowNull: false, unique: true },
  isCurrent: { type: DataTypes.BOOLEAN, defaultValue: false }
});
