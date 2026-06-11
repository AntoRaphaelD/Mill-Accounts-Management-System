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

export const saveTds = sendSave(accountService.saveTds);
export const deleteTds = sendDelete(accountService.deleteTds, "code");
export const saveServiceTax = sendSave(accountService.saveServiceTax);
export const deleteServiceTax = sendDelete(accountService.deleteServiceTax, "code");
