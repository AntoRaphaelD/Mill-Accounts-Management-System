import { PLSetting } from "../models/index.js";

// GET /api/plsettings
export const getAllPlSettings = async (req, res, next) => {
  try {
    const records = await PLSetting.findAll();
    const data = records.map(record => ({
      ...record.toJSON(),
      ...(record.payload || {})
    }));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/plsettings
export const savePlSetting = async (req, res, next) => {
  try {
    const data = req.body;
    const id = data.id || `PL-${Date.now()}`;
    
    const recordData = {
      id,
      groupDescription: data.groupDescription || "",
      ledger: data.ledger || "",
      slNo1: parseInt(data.slNo1) || 0,
      slNo: parseInt(data.slNo) || 0,
      payload: data
    };
    
    await PLSetting.upsert(recordData);
    
    res.json({ success: true, data: recordData });
  } catch (error) {
    console.error("P&L Setting Save Error:", error);
    next(error);
  }
};

// DELETE /api/plsettings/:id
export const deletePlSetting = async (req, res, next) => {
  try {
    await PLSetting.destroy({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};