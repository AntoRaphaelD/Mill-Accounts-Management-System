import { ReverseCharge } from "../models/index.js";

// GET /api/reverse-charges
export const getAllReverseCharges = async (req, res, next) => {
  try {
    const records = await ReverseCharge.findAll();
    const data = records.map(record => ({
      ...record.toJSON(),
      ...(record.payload || {})
    }));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/reverse-charges
export const saveReverseCharge = async (req, res, next) => {
  try {
    const data = req.body;
    const recordData = {
      code: data.code,
      purchaseType: data.purchaseType || "",
      
      assessValueFormula: data.assessValueFormula || "",
      assessValueDesc: data.assessValueDesc || "",
      roundOffFormula: data.roundOffFormula || "",
      roundOffDesc: data.roundOffDesc || "",
      lorryFreightFormula: data.lorryFreightFormula || "",
      lorryFreightDesc: data.lorryFreightDesc || "",
      
      sgstFormula: data.sgstFormula || "",
      sgstLedger: data.sgstLedger || "",
      cgstFormula: data.cgstFormula || "",
      cgstLedger: data.cgstLedger || "",
      igstFormula: data.igstFormula || "",
      igstLedger: data.igstLedger || "",
      
      creditSgstLedger: data.creditSgstLedger || "",
      creditCgstLedger: data.creditCgstLedger || "",
      creditIgstLedger: data.creditIgstLedger || "",
      
      payload: data
    };
    
    await ReverseCharge.upsert(recordData);
    res.json({ success: true, data: recordData });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/reverse-charges/:code
export const deleteReverseCharge = async (req, res, next) => {
  try {
    await ReverseCharge.destroy({ where: { code: req.params.code } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};