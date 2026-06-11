import { BSGroup } from "../models/index.js";

// GET /api/bsgroups
export const getAllBsGroups = async (req, res, next) => {
  try {
    const records = await BSGroup.findAll();
    const data = records.map(record => ({
      ...record.toJSON(),
      ...(record.payload || {})
    }));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/bsgroups
export const saveBsGroup = async (req, res, next) => {
  try {
    const data = req.body;
    const recordData = {
      code: data.code,
      bsGroup: data.bsGroup || "",
      accGroup: data.accGroup || "",
      slNo: parseInt(data.slNo) || 0,
      ifNegative: data.ifNegative || "",
      defaultSide: data.defaultSide || "Credit",
      payload: data
    };
    
    await BSGroup.upsert(recordData);
    res.json({ success: true, data: recordData });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/bsgroups/:code
export const deleteBsGroup = async (req, res, next) => {
  try {
    await BSGroup.destroy({ where: { code: req.params.code } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};