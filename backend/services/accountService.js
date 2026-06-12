import { Account, AppRecord, Group, ServiceTaxMaster, SubGroup, TDSMaster, PLSetting, BSMainGroup, BSGroup, ReverseCharge, BillWiseOpening } from "../models/index.js";

const unwrap = (row) => {
  const plain = row.toJSON();
  return { ...plain.payload, ...plain };
};

// const upsertByKey = async (Model, keyField, data, fallbackPrefix) => {
//   const key = data[keyField] || `${fallbackPrefix}${Date.now()}`;
//   const payload = { ...data, [keyField]: key };
//   await Model.upsert({ ...payload, payload });
//   return payload;
// };
// Ensure this function in accountService.js is exactly like this:
const upsertByKey = async (Model, keyField, data, fallbackPrefix) => {
  const key = data[keyField] || `${fallbackPrefix}${Date.now()}`;
  
  // We create a clean object for the individual columns
  // AND we store the whole thing in the 'payload' column for the UI
  const recordData = { 
    ...data, 
    [keyField]: key,
    payload: data // This ensures the UI's JSON structure stays intact
  };
  
  await Model.upsert(recordData);
  return recordData;
};
const destroyByKey = (Model, keyField, key) => Model.destroy({ where: { [keyField]: key } });

const listAppRecords = async (collection) => {
  const rows = await AppRecord.findAll({ where: { collection }, order: [["updatedAt", "ASC"]] });
  return rows.map((row) => row.payload);
};

const upsertAppRecord = async (collection, keyField, data, fallbackPrefix) => {
  const recordKey = data[keyField] || `${fallbackPrefix}${Date.now()}`;
  const payload = { ...data, [keyField]: recordKey };
  await AppRecord.upsert({ collection, recordKey, payload });
  return payload;
};

const deleteAppRecord = (collection, recordKey) => AppRecord.destroy({ where: { collection, recordKey } });

export const getMastersState = async () => ({
  groups: (await Group.findAll()).map(unwrap),
  subGroups: (await SubGroup.findAll()).map(unwrap),
  accounts: (await Account.findAll()).map(unwrap),
  tds: (await TDSMaster.findAll()).map(unwrap),
  serviceTax: (await ServiceTaxMaster.findAll()).map(unwrap),
  plSettings: (await PLSetting.findAll()).map(unwrap),
  bsMainGroups: (await BSMainGroup.findAll()).map(unwrap),
  bsGroups: (await BSGroup.findAll()).map(unwrap),
  reverseTypes: (await ReverseCharge.findAll()).map(unwrap),
  billWiseOpenings: (await BillWiseOpening.findAll()).map(unwrap),
  closingStock: await listAppRecords("closingStock")
});

export const saveAccount = (data) => upsertByKey(Account, "code", data, "ACC");
export const deleteAccount = (code) => destroyByKey(Account, "code", code);
export const saveGroup = (data) => upsertByKey(Group, "id", data, "G");
export const deleteGroup = (id) => destroyByKey(Group, "id", id);
export const saveSubGroup = async (data) => {
  const saved = await upsertByKey(SubGroup, "id", data, "SG");
  
  const id = saved?.id ?? data?.id;
  const row = await SubGroup.findOne({ where: { id } });
  if (!row) return saved;
  
  const plain = row.toJSON();
  return { ...plain.payload, ...plain };
};
export const deleteSubGroup = (id) => destroyByKey(SubGroup, "id", id);
export const saveTds = async (data) => {
  const saved = await upsertByKey(TDSMaster, "code", data, "TDS");

  // Re-fetch to confirm what is actually persisted in DB.
  // This ensures controller returns the real persisted shape.
  const code = saved?.code ?? data?.code;
  const row = await TDSMaster.findOne({ where: { code } });
  if (!row) return saved;

  const plain = row.toJSON();
  // If payload is stored, merge it back so UI receives flat shape.
  return { ...plain.payload, ...plain };
};
export const deleteTds = (code) => destroyByKey(TDSMaster, "code", code);
export const saveServiceTax = async (data) => {
  const saved = await upsertByKey(ServiceTaxMaster, "code", data, "ST");
  
  const code = saved?.code ?? data?.code;
  const row = await ServiceTaxMaster.findOne({ where: { code } });
  if (!row) return saved;
  
  const plain = row.toJSON();
  return { ...plain.payload, ...plain };
};
export const deleteServiceTax = (code) => destroyByKey(ServiceTaxMaster, "code", code);
export const saveBillWiseOpening = (data) => upsertByKey(BillWiseOpening, "id", data, "BWO");
export const deleteBillWiseOpening = (id) => destroyByKey(BillWiseOpening, "id", id);
export const saveClosingStock = (data) => upsertAppRecord("closingStock", "id", data, "CS");
export const deleteClosingStock = (id) => deleteAppRecord("closingStock", id);
