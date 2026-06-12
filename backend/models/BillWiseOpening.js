import { DataTypes } from "sequelize";

export default (sequelize) => {
  const BillWiseOpening = sequelize.define("BillWiseOpening", {
    id: { 
      type: DataTypes.STRING, 
      primaryKey: true 
    },
    subGroup: { 
      type: DataTypes.STRING 
    },
    partyName: { 
      type: DataTypes.STRING 
    },
    billNo: { 
      type: DataTypes.STRING 
    },
    billDate: { 
      type: DataTypes.DATEONLY 
    },
    credit: { 
      type: DataTypes.DECIMAL(18, 2), 
      defaultValue: 0 
    },
    debit: { 
      type: DataTypes.DECIMAL(18, 2), 
      defaultValue: 0 
    },
    remarks: { 
      type: DataTypes.STRING(500) 
    },
    payload: { 
      type: DataTypes.JSON 
    }
  });

  return BillWiseOpening;
};