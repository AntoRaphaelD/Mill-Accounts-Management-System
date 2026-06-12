import { Voucher, VoucherItem, AppRecord, ContraEntry, ContraEntryItem, Provision, ProvisionItem } from "../models/index.js";

const unwrapVoucher = (row) => {
  const plain = row.toJSON();
  return {
    ...plain.payload,
    ...plain,
    items: plain.items?.map((item) => ({ ...item.payload, ...item })) || plain.payload?.items || []
  };
};

export const getVoucherState = async () => {
  const regularVouchers = (await Voucher.findAll({ include: [{ model: VoucherItem, as: "items" }], order: [["updatedAt", "DESC"]] })).map(unwrapVoucher);
  const contraEntries = (await ContraEntry.findAll({ include: [{ model: ContraEntryItem, as: "items" }], order: [["updatedAt", "DESC"]] })).map(unwrapVoucher);
  const provisions = (await Provision.findAll({ include: [{ model: ProvisionItem, as: "items" }], order: [["updatedAt", "DESC"]] })).map(unwrapVoucher);

  // Unified push payload keeps the frontend intact
  return {
    vouchers: [...regularVouchers, ...contraEntries, ...provisions],
    reverseBills: (await AppRecord.findAll({ where: { collection: "reverseBills" }, order: [["updatedAt", "DESC"]] })).map((row) => row.payload)
  };
};

export const saveVoucher = async (data) => {
  const items = data.items || [];
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.debit) || 0), 0)
    || items.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
  const id = data.id || `V${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const payload = { ...data, id, totalAmount };

  await Voucher.upsert({ ...payload, payload });
  await VoucherItem.destroy({ where: { voucherId: id } });
  await VoucherItem.bulkCreate(items.map((item) => ({
    voucherId: id,
    accountCode: item.accountCode,
    debit: item.debit || 0,
    credit: item.credit || 0,
    narration: item.narration,
    payload: item
  })));

  return payload;
};

export const deleteVoucher = (id) => Voucher.destroy({ where: { id } });

export const saveContraEntry = async (data) => {
  const items = data.items || [];
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.debit) || 0), 0)
    || items.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
  const id = data.id || `CT-${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const payload = { ...data, id, totalAmount };

  await ContraEntry.upsert({ ...payload, payload });
  await ContraEntryItem.destroy({ where: { contraEntryId: id } });
  await ContraEntryItem.bulkCreate(items.map((item) => ({
    contraEntryId: id,
    accountCode: item.accountCode,
    debit: item.debit || 0,
    credit: item.credit || 0,
    narration: item.narration,
    payload: item
  })));

  return payload;
};

export const deleteContraEntry = (id) => ContraEntry.destroy({ where: { id } });

export const saveProvision = async (data) => {
  const items = data.items || [];
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.debit) || 0), 0)
    || items.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
  const id = data.id || `PRV-${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const payload = { ...data, id, totalAmount };

  await Provision.upsert({ ...payload, payload });
  await ProvisionItem.destroy({ where: { provisionId: id } });
  await ProvisionItem.bulkCreate(items.map((item) => ({
    provisionId: id,
    accountCode: item.accountCode,
    debit: item.debit || 0,
    credit: item.credit || 0,
    narration: item.narration,
    payload: item
  })));

  return payload;
};

export const deleteProvision = (id) => Provision.destroy({ where: { id } });

export const saveReverseBill = async (data) => {
  const recordKey = data.id || `RB${Date.now()}`;
  const payload = { ...data, id: recordKey };
  await AppRecord.upsert({ collection: "reverseBills", recordKey, payload });
  return payload;
};

export const deleteReverseBill = (id) => AppRecord.destroy({ where: { collection: "reverseBills", recordKey: id } });
