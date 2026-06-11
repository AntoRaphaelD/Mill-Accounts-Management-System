import { BSMainGroup } from "../models/index.js";

// GET /api/bsmaingroups
export const getAllBsMainGroups = async (req, res, next) => {
  try {
    const records = await BSMainGroup.findAll();
    const data = records.map(record => ({
      ...record.toJSON(),
      ...(record.payload || {})
    }));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/bsmaingroups
export const saveBsMainGroup = async (req, res, next) => {
  try {
    const data = req.body;
    const recordData = {
      code: data.code,
      mainGroup: data.mainGroup || "",
      under: data.under || "",
      payload: data
    };
    
    await BSMainGroup.upsert(recordData);
    res.json({ success: true, data: recordData });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/bsmaingroups/:code
export const deleteBsMainGroup = async (req, res, next) => {
  try {
    await BSMainGroup.destroy({ where: { code: req.params.code } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};