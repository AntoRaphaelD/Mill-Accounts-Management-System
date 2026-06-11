import * as accountService from "../services/accountService.js";

const sendSave = (handler) => async (req, res, next) => {
  try {
    res.json({ success: true, data: await handler(req.body) });
  } catch (error) {
    next(error);
  }
};

const sendDelete = (handler, param) => async (req, res, next) => {
  try {
    await handler(req.params[param]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const saveAccount = sendSave(accountService.saveAccount);
export const deleteAccount = sendDelete(accountService.deleteAccount, "code");
export const saveGroup = sendSave(accountService.saveGroup);
export const deleteGroup = sendDelete(accountService.deleteGroup, "id");
export const saveSubGroup = sendSave(accountService.saveSubGroup);
export const deleteSubGroup = sendDelete(accountService.deleteSubGroup, "id");
export const saveBillWiseOpening = sendSave(accountService.saveBillWiseOpening);
export const deleteBillWiseOpening = sendDelete(accountService.deleteBillWiseOpening, "id");
export const saveClosingStock = sendSave(accountService.saveClosingStock);
export const deleteClosingStock = sendDelete(accountService.deleteClosingStock, "id");
