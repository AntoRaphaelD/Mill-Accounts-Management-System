import { Voucher, VoucherItem, AppRecord } from "../models/index.js";

const unwrapVoucher = (row) => {
  const plain = row.toJSON();
  return {
    ...plain.payload,
    ...plain,
    items: plain.items?.map((item) => ({ ...item.payload, ...item })) || plain.payload?.items || []
  };
};

export const getVoucherState = async () => ({
  vouchers: (await Voucher.findAll({ include: [{ model: VoucherItem, as: "items" }], order: [["updatedAt", "DESC"]] })).map(unwrapVoucher),
  reverseBills: (await AppRecord.findAll({ where: { collection: "reverseBills" }, order: [["updatedAt", "DESC"]] })).map((row) => row.payload)
});

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

export const saveReverseBill = async (data) => {
  const recordKey = data.id || `RB${Date.now()}`;
  const payload = { ...data, id: recordKey };
  await AppRecord.upsert({ collection: "reverseBills", recordKey, payload });
  return payload;
};

export const deleteReverseBill = (id) => AppRecord.destroy({ where: { collection: "reverseBills", recordKey: id } });
