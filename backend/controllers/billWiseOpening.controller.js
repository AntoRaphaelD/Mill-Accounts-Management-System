import { BillWiseOpening } from "../models/index.js";

const unwrap = (row) => {
  const plain = row.toJSON();
  return { ...plain.payload, ...plain };
};

export const getAll = async (req, res, next) => {
  try {
    const rows = await BillWiseOpening.findAll({ order: [["updatedAt", "DESC"]] });
    res.json({ success: true, data: rows.map(unwrap) });
  } catch (error) {
    next(error);
  }
};

export const upsert = async (req, res, next) => {
  try {
    const data = req.body;
    const key = data.id || `BWO-${Date.now()}`;
    const recordData = { ...data, id: key, payload: data };
    
    await BillWiseOpening.upsert(recordData);
    res.json({ success: true, data: recordData });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await BillWiseOpening.destroy({ where: { id } });
    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    next(error);
  }
};